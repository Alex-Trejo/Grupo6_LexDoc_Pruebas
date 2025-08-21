// tests/EventRepository.test.js

import { EventRepository } from '../src/repositories/EventRepository.js';
import pool from '../src/config/db.js';

// Mockeamos el pool de la base de datos para aislar el repositorio.
jest.mock('../src/config/db.js');

describe('EventRepository', () => {
  let eventRepository;

  beforeEach(() => {
    eventRepository = new EventRepository();
    jest.clearAllMocks();
  });

  // --- Pruebas para el método create ---
  describe('create', () => {
    it('debería crear un nuevo evento', async () => {
      // Arrange
      const eventData = { name: 'Audiencia', description: 'Detalle', date: new Date(), order: 1, timeline_id: 1 };
      const mockDbResponse = { rows: [{ event_id: 1, ...eventData }] };
      pool.query.mockResolvedValue(mockDbResponse);

      // Act
      const result = await eventRepository.create(eventData);

      // Assert
      expect(result).toEqual({ event_id: 1, ...eventData });
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO event (name, description, date, "order", timeline_id) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [eventData.name, eventData.description, eventData.date, eventData.order, eventData.timeline_id]
      );
    });
  });

  // --- Pruebas para el método findById ---
  describe('findById', () => {
    it('debería encontrar un evento por su ID', async () => {
      const eventId = 1;
      const mockEvent = { event_id: eventId, name: 'Audiencia' };
      pool.query.mockResolvedValue({ rows: [mockEvent] });

      const result = await eventRepository.findById(eventId);

      expect(result).toEqual(mockEvent);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM event WHERE event_id = $1', [eventId]);
    });
  });

  // --- Pruebas para el método update ---
  describe('update', () => {
    it('debería actualizar un evento completamente', async () => {
      const eventData = { event_id: 1, name: 'Audiencia Actualizada', description: 'Nuevo Detalle', date: new Date(), order: 2 };
      pool.query.mockResolvedValue({ rows: [eventData] });

      const result = await eventRepository.update(eventData);

      expect(result).toEqual(eventData);
      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE event SET name=$1, description=$2, date=$3, "order"=$4 WHERE event_id=$5 RETURNING *',
        [eventData.name, eventData.description, eventData.date, eventData.order, eventData.event_id]
      );
    });
  });

  // --- Pruebas para el método updatePartial ---
  describe('updatePartial', () => {
    it('debería actualizar un evento parcialmente usando COALESCE', async () => {
      const eventData = { event_id: 1, name: 'Título Parcial' };
      const mockResult = { event_id: 1, name: 'Título Parcial', description: 'Descripción original' };
      pool.query.mockResolvedValue({ rows: [mockResult] });

      const result = await eventRepository.updatePartial(eventData);

      expect(result).toEqual(mockResult);
      // **INICIO DE LA CORRECCIÓN**
      // 1. Verificamos que la función fue llamada una vez.
      expect(pool.query).toHaveBeenCalledTimes(1);
      
      // 2. Extraemos los argumentos con los que fue llamada.
      const firstCallArgs = pool.query.mock.calls[0];
      const queryString = firstCallArgs[0];
      const values = firstCallArgs[1];

      // 3. Hacemos aserciones específicas y claras sobre los argumentos.
      expect(queryString).toContain('UPDATE event SET');
      expect(queryString).toContain('name = COALESCE($1, name)');
      expect(queryString).toContain('description = COALESCE($2, description)');
      expect(values).toEqual([eventData.name, eventData.description, eventData.date, eventData.event_id]);
      // **FIN DE LA CORRECCIÓN**
    });
  });

  // --- Pruebas para el método delete ---
  describe('delete', () => {
    it('debería eliminar un evento', async () => {
      const eventId = 1;
      // Para DELETE, pool.query no devuelve filas.
      pool.query.mockResolvedValue({ rows: [] });

      await eventRepository.delete(eventId);

      expect(pool.query).toHaveBeenCalledWith('DELETE FROM event WHERE event_id=$1', [eventId]);
    });
  });

  // --- Pruebas para el método reorderTimelineEvents ---
   describe('reorderTimelineEvents', () => {
    it('debería reordenar los eventos de un timeline', async () => {
      const timelineId = 1;
      const mockSelectResponse = { rows: [{ event_id: 10 }, { event_id: 5 }, { event_id: 12 }] };
      pool.query.mockResolvedValueOnce(mockSelectResponse);
      pool.query.mockResolvedValue({ rows: [] });

      await eventRepository.reorderTimelineEvents(timelineId);

      // Verificamos el SELECT inicial
      const selectQueryArgs = pool.query.mock.calls[0];
      expect(selectQueryArgs[0]).toContain('ORDER BY "order" ASC, event_id ASC');

      // Verificamos las llamadas UPDATE
      expect(pool.query).toHaveBeenCalledWith('UPDATE event SET "order" = $1 WHERE event_id = $2', [1, 10]);
      expect(pool.query).toHaveBeenCalledWith('UPDATE event SET "order" = $1 WHERE event_id = $2', [2, 5]);
      expect(pool.query).toHaveBeenCalledWith('UPDATE event SET "order" = $1 WHERE event_id = $2', [3, 12]);
      expect(pool.query).toHaveBeenCalledTimes(4);
    });

    it('no debería hacer ninguna llamada UPDATE si no hay eventos que reordenar', async () => {
        const timelineId = 2;
        const mockSelectResponse = { rows: [] };
        pool.query.mockResolvedValueOnce(mockSelectResponse);

        await eventRepository.reorderTimelineEvents(timelineId);

        expect(pool.query).toHaveBeenCalledTimes(1);
        // **INICIO DE LA CORRECCIÓN**
        // Hacemos el string a buscar más específico para que coincida con la query real.
        const firstCallArgs = pool.query.mock.calls[0];
        const queryString = firstCallArgs[0];
        const values = firstCallArgs[1];

        expect(queryString).toContain('SELECT event_id');
        expect(queryString).toContain('ORDER BY "order" ASC, event_id ASC');
        expect(values).toEqual([timelineId]);
        // **FIN DE LA CORRECCIÓN**
    });
  });

  // --- Pruebas para el método findByTimelineId ---
  describe('findByTimelineId', () => {
    it('debería encontrar todos los eventos de un timeline', async () => {
      const timelineId = 1;
      const mockEvents = [{ event_id: 1 }, { event_id: 2 }];
      pool.query.mockResolvedValue({ rows: mockEvents });

      const result = await eventRepository.findByTimelineId(timelineId);

      expect(result).toEqual(mockEvents);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM event WHERE timeline_id = $1 ORDER BY "order"', [timelineId]);
    });
  });
});
// tests/TimelineRepository.test.js

import { TimelineRepository } from '../src/repositories/TimelineRepository.js';
import pool from '../src/config/db.js';

// Mock del pool de la base de datos para realizar pruebas aisladas y predecibles.
jest.mock('../src/config/db.js');

describe('TimelineRepository', () => {
  let timelineRepository;

  beforeEach(() => {
    timelineRepository = new TimelineRepository();
    jest.clearAllMocks();
  });

  // --- Pruebas para el método create ---
  describe('create', () => {
    it('debería crear un nuevo timeline y devolverlo', async () => {
      // Arrange
      const timelineData = { number_events: 0, process_id: 1 };
      const mockDbResponse = { rows: [{ timeline_id: 10, ...timelineData }] };
      pool.query.mockResolvedValue(mockDbResponse);

      // Act
      const result = await timelineRepository.create(timelineData);

      // Assert
      expect(result).toEqual({ timeline_id: 10, ...timelineData });
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO timeline (number_events, process_id) VALUES ($1, $2) RETURNING *',
        [timelineData.number_events, timelineData.process_id]
      );
    });
  });

  // --- Pruebas para el método findByProcessId ---
  describe('findByProcessId', () => {
    it('debería encontrar un timeline por el ID del proceso', async () => {
      const processId = 1;
      const mockTimeline = { timeline_id: 10, process_id: processId };
      pool.query.mockResolvedValue({ rows: [mockTimeline] });

      const result = await timelineRepository.findByProcessId(processId);

      expect(result).toEqual(mockTimeline);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM timeline WHERE process_id = $1', [processId]);
    });

    it('debería devolver undefined si no se encuentra el timeline', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await timelineRepository.findByProcessId(999);
      expect(result).toBeUndefined();
    });
  });

  // --- Pruebas para el método findById ---
  describe('findById', () => {
    it('debería encontrar un timeline por su propio ID', async () => {
      const timelineId = 10;
      const mockTimeline = { timeline_id: timelineId, process_id: 1 };
      pool.query.mockResolvedValue({ rows: [mockTimeline] });

      const result = await timelineRepository.findById(timelineId);

      expect(result).toEqual(mockTimeline);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM timeline WHERE timeline_id = $1', [timelineId]);
    });
  });

  // --- Pruebas para el método decrementEventCount ---
  describe('decrementEventCount', () => {
    it('debería ejecutar la consulta para decrementar el contador de eventos', async () => {
      const timelineId = 10;
      pool.query.mockResolvedValue({ rows: [] }); // No esperamos un retorno

      await timelineRepository.decrementEventCount(timelineId);

      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE timeline SET number_events = number_events - 1 WHERE timeline_id = $1',
        [timelineId]
      );
      expect(pool.query).toHaveBeenCalledTimes(1);
    });
  });

  // --- Pruebas para el método update ---
  describe('update', () => {
    it('debería actualizar el número de eventos y devolver el timeline actualizado', async () => {
      const timelineData = { timeline_id: 10, number_events: 5 };
      const mockUpdatedTimeline = { ...timelineData, process_id: 1 };
      pool.query.mockResolvedValue({ rows: [mockUpdatedTimeline] });

      const result = await timelineRepository.update(timelineData);

      expect(result).toEqual(mockUpdatedTimeline);
      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE timeline SET number_events = $1 WHERE timeline_id = $2 RETURNING *',
        [timelineData.number_events, timelineData.timeline_id]
      );
    });
  });

  // --- Pruebas para el método delete (y su duplicado deleteTimeline) ---
  describe('delete', () => {
    it('debería ejecutar la consulta DELETE para un timeline', async () => {
      const timelineId = 10;
      pool.query.mockResolvedValue({ rows: [] }); // DELETE no devuelve filas.

      await timelineRepository.delete(timelineId);

      expect(pool.query).toHaveBeenCalledWith('DELETE FROM timeline WHERE timeline_id = $1', [timelineId]);
      expect(pool.query).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteTimeline', () => {
    it('debería ejecutar la consulta DELETE para un timeline (método duplicado)', async () => {
      const timelineId = 20;
      pool.query.mockResolvedValue({ rows: [] });

      await timelineRepository.deleteTimeline(timelineId);

      expect(pool.query).toHaveBeenCalledWith('DELETE FROM timeline WHERE timeline_id = $1', [timelineId]);
      expect(pool.query).toHaveBeenCalledTimes(1);
    });
  });
});
// tests/ObservationRepository.test.js

import { ObservationRepository } from '../src/repositories/ObservationRepository.js';
import pool from '../src/config/db.js';

// Mock del pool de la base de datos para evitar conexiones reales.
jest.mock('../src/config/db.js');

describe('ObservationRepository', () => {
  let observationRepository;

  beforeEach(() => {
    observationRepository = new ObservationRepository();
    jest.clearAllMocks();
  });

  // --- Pruebas para el método create ---
  describe('create', () => {
    it('debería crear una nueva observación y devolverla', async () => {
      // Arrange
      const observationData = { title: 'Título', content: 'Contenido', process_id: 1 };
      const mockDbResponse = { rows: [{ observation_id: 101, ...observationData }] };
      pool.query.mockResolvedValue(mockDbResponse);

      // Act
      const result = await observationRepository.create(observationData);

      // Assert
      expect(result).toEqual({ observation_id: 101, ...observationData });
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO observation (title, content, process_id) VALUES ($1, $2, $3) RETURNING *',
        [observationData.title, observationData.content, observationData.process_id]
      );
    });
  });

  // --- Pruebas para el método findById ---
  describe('findById', () => {
    it('debería encontrar una observación por su ID', async () => {
      const observationId = 101;
      const mockObservation = { observation_id: observationId, title: 'Test' };
      pool.query.mockResolvedValue({ rows: [mockObservation] });

      const result = await observationRepository.findById(observationId);

      expect(result).toEqual(mockObservation);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM observation WHERE observation_id = $1', [observationId]);
    });

    it('debería devolver undefined si la observación no se encuentra', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await observationRepository.findById(999);
      expect(result).toBeUndefined();
    });
  });

  // --- Pruebas para el método update ---
  describe('update', () => {
    it('debería actualizar una observación y devolver los datos actualizados', async () => {
      const updateData = { observation_id: 101, title: 'Título Actualizado', content: 'Contenido Actualizado' };
      pool.query.mockResolvedValue({ rows: [updateData] });

      const result = await observationRepository.update(updateData);

      expect(result).toEqual(updateData);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE observation'),
        [updateData.title, updateData.content, updateData.observation_id]
      );
    });
  });

  // --- Pruebas para el método findWithProcess ---
  describe('findWithProcess', () => {
    it('debería encontrar una observación con los datos del dueño del proceso', async () => {
      const observationId = 101;
      const mockResult = { observation_id: observationId, title: 'Test', process_owner: 1 };
      pool.query.mockResolvedValue({ rows: [mockResult] });

      const result = await observationRepository.findWithProcess(observationId);

      expect(result).toEqual(mockResult);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT o.*, p.account_id AS process_owner'),
        [observationId]
      );
    });
  });

  // --- Pruebas para el método delete ---
  describe('delete', () => {
    it('debería ejecutar la consulta DELETE para una observación', async () => {
      const observationId = 101;
      pool.query.mockResolvedValue({ rows: [] }); // DELETE no devuelve filas.

      await observationRepository.delete(observationId);

      expect(pool.query).toHaveBeenCalledWith('DELETE FROM observation WHERE observation_id=$1', [observationId]);
      expect(pool.query).toHaveBeenCalledTimes(1);
    });
  });

  // --- Pruebas para el método findByProcessId ---
  describe('findByProcessId', () => {
    it('debería encontrar todas las observaciones para un ID de proceso', async () => {
      const processId = 1;
      const mockObservations = [
        { observation_id: 101, process_id: processId },
        { observation_id: 102, process_id: processId },
      ];
      pool.query.mockResolvedValue({ rows: mockObservations });

      const result = await observationRepository.findByProcessId(processId);

      expect(result).toEqual(mockObservations);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM observation WHERE process_id = $1', [processId]);
    });

    it('debería devolver un array vacío si no hay observaciones para el proceso', async () => {
      const processId = 2;
      pool.query.mockResolvedValue({ rows: [] });

      const result = await observationRepository.findByProcessId(processId);

      expect(result).toEqual([]);
    });
  });
});
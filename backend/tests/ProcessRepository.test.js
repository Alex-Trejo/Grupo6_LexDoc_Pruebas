// tests/ProcessRepository.test.js

import { ProcessRepository } from '../src/repositories/ProcessRepository.js';
import pool from '../src/config/db.js';

// Mock del pool de la base de datos para evitar conexiones reales.
jest.mock('../src/config/db.js');

describe('ProcessRepository', () => {
  let processRepository;

  beforeEach(() => {
    processRepository = new ProcessRepository();
    jest.clearAllMocks();
  });

  // --- Pruebas para el método create ---
  describe('create', () => {
    it('debería crear un nuevo proceso y devolverlo', async () => {
      // Arrange
      const processData = {
        title: 'Caso Test', type: 'Civil', offense: 'Incumplimiento', last_update: new Date(),
        denounced: 'Demandado', denouncer: 'Demandante', province: 'Test', carton: '123', account_id: 1
      };
      const mockDbResponse = { rows: [{ process_id: 10, ...processData }] };
      pool.query.mockResolvedValue(mockDbResponse);

      // Act
      const result = await processRepository.create(processData);

      // Assert
      expect(result).toEqual({ process_id: 10, ...processData });
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO process (title, type, offense, last_update, denounced, denouncer, province, carton, account_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
        [
          processData.title, processData.type, processData.offense, processData.last_update,
          processData.denounced, processData.denouncer, processData.province, processData.carton,
          processData.account_id
        ]
      );
    });

    it('debería devolver null si la creación falla y no devuelve filas', async () => {
        pool.query.mockResolvedValue({ rows: [] });
        const result = await processRepository.create({});
        expect(result).toBeNull();
    });
  });

  // --- Pruebas para el método findById ---
  describe('findById', () => {
    it('debería encontrar un proceso por su ID', async () => {
      const processId = 10;
      const mockProcess = { process_id: processId, title: 'Caso Encontrado' };
      pool.query.mockResolvedValue({ rows: [mockProcess] });

      const result = await processRepository.findById(processId);

      expect(result).toEqual(mockProcess);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM process WHERE process_id = $1', [processId]);
    });

    it('debería devolver null si el proceso no se encuentra', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await processRepository.findById(999);
      expect(result).toBeNull();
    });
  });

  // --- Pruebas para el método findByAccountId ---
  describe('findByAccountId', () => {
    it('debería encontrar todos los procesos para un ID de cuenta', async () => {
      const accountId = 1;
      const mockProcesses = [{ process_id: 10 }, { process_id: 11 }];
      pool.query.mockResolvedValue({ rows: mockProcesses });

      const result = await processRepository.findByAccountId(accountId);

      expect(result).toEqual(mockProcesses);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM process WHERE account_id = $1', [accountId]);
    });
  });

  // --- Pruebas para el método update ---
  describe('update', () => {
    it('debería actualizar un proceso y devolver los datos actualizados', async () => {
      const processData = { process_id: 10, title: 'Título Actualizado' };
      const mockUpdatedProcess = { process_id: 10, title: 'Título Actualizado', type: 'Civil' };
      pool.query.mockResolvedValue({ rows: [mockUpdatedProcess] });

      const result = await processRepository.update(processData);

      expect(result).toEqual(mockUpdatedProcess);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE process SET'),
        [
          processData.title, processData.type, processData.offense, expect.any(Date),
          processData.denounced, processData.denouncer, processData.province,
          processData.carton, processData.process_id
        ]
      );
    });
  });

  // --- Pruebas para el método delete ---
  describe('delete', () => {
    it('debería ejecutar la consulta DELETE para un proceso', async () => {
      const processId = 10;
      pool.query.mockResolvedValue({ rows: [] });

      await processRepository.delete(processId);

      expect(pool.query).toHaveBeenCalledWith('DELETE FROM process WHERE process_id = $1', [processId]);
    });
  });

  // --- Pruebas para el método findAll ---
  describe('findAll', () => {
    it('debería devolver todos los procesos ordenados por last_update', async () => {
      const mockProcesses = [{ process_id: 1 }, { process_id: 2 }];
      pool.query.mockResolvedValue({ rows: mockProcesses });

      const result = await processRepository.findAll();

      expect(result).toEqual(mockProcesses);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM process ORDER BY last_update DESC');
    });
  });
});
// tests/ProcessService.test.js

import { ProcessService } from '../src/services/ProcessService.js';
import { ProcessRepository } from '../src/repositories/ProcessRepository.js';
import { TimelineRepository } from '../src/repositories/TimelineRepository.js';
import { EventRepository } from '../src/repositories/EventRepository.js';
import { ObservationRepository } from '../src/repositories/ObservationRepository.js';

// Mockeamos TODOS los repositorios de los que depende el servicio.
jest.mock('../src/repositories/ProcessRepository.js');
jest.mock('../src/repositories/TimelineRepository.js');
jest.mock('../src/repositories/EventRepository.js');
jest.mock('../src/repositories/ObservationRepository.js');

describe('ProcessService', () => {
  let processService;

  beforeEach(() => {
    processService = new ProcessService();
    jest.clearAllMocks();
  });

  // --- Pruebas para createProcess ---
  describe('createProcess', () => {
    it('debería crear un proceso y un timeline asociado', async () => {
      // Arrange
      const processData = { title: 'Test' };
      const createdProcess = { process_id: 1, ...processData };
      ProcessRepository.prototype.create.mockResolvedValue(createdProcess);
      TimelineRepository.prototype.create.mockResolvedValue({}); // No necesitamos el resultado

      // Act
      const result = await processService.createProcess(processData);

      // Assert
      expect(ProcessRepository.prototype.create).toHaveBeenCalledWith(processData);
      expect(TimelineRepository.prototype.create).toHaveBeenCalledWith({
        process_id: createdProcess.process_id,
        number_events: 0,
      });
      expect(result).toEqual(createdProcess);
    });
  });

  // --- Pruebas para updateProcess ---
  describe('updateProcess', () => {
    it('debería llamar a processRepo.update', async () => {
      const processData = { process_id: 1, title: 'Updated' };
      ProcessRepository.prototype.update.mockResolvedValue(processData);
      const result = await processService.updateProcess(processData);
      expect(ProcessRepository.prototype.update).toHaveBeenCalledWith(processData);
      expect(result).toEqual(processData);
    });
  });
  
  // --- Pruebas para deleteProcess ---
  describe('deleteProcess', () => {
    it('debería llamar a processRepo.delete', async () => {
      const processId = 1;
      await processService.deleteProcess(processId);
      expect(ProcessRepository.prototype.delete).toHaveBeenCalledWith(processId);
    });
  });

  // --- Pruebas para getProcessesByAccountId ---
  describe('getProcessesByAccountId', () => {
    it('debería llamar a processRepo.findByAccountId', async () => {
        const accountId = 1;
        await processService.getProcessesByAccountId(accountId);
        expect(ProcessRepository.prototype.findByAccountId).toHaveBeenCalledWith(accountId);
      });
  });

  // --- Pruebas para getProcessById ---
  describe('getProcessById', () => {
    const processId = 1;
    const accountId = 10;

    it('debería devolver un proceso con todos sus datos relacionados', async () => {
      // Arrange
      const mockProcess = { process_id: processId, account_id: accountId };
      const mockTimeline = { timeline_id: 5 };
      const mockEvents = [{ id: 1 }];
      const mockObservations = [{ id: 101 }];

      ProcessRepository.prototype.findById.mockResolvedValue(mockProcess);
      TimelineRepository.prototype.findByProcessId.mockResolvedValue(mockTimeline);
      EventRepository.prototype.findByTimelineId.mockResolvedValue(mockEvents);
      ObservationRepository.prototype.findByProcessId.mockResolvedValue(mockObservations);

      // Act
      const result = await processService.getProcessById(processId, accountId);

      // Assert
      expect(result).toEqual({
        ...mockProcess,
        timeline: mockTimeline,
        events: mockEvents,
        observations: mockObservations,
      });
    });

    it('debería lanzar error "Process not found"', async () => {
      ProcessRepository.prototype.findById.mockResolvedValue(null);
      await expect(processService.getProcessById(processId, accountId)).rejects.toThrow('Process not found');
    });

    it('debería lanzar error "Unauthorized access"', async () => {
      const mockProcess = { process_id: processId, account_id: 99 }; // Otro usuario
      ProcessRepository.prototype.findById.mockResolvedValue(mockProcess);
      await expect(processService.getProcessById(processId, accountId)).rejects.toThrow('Unauthorized access to this process');
    });
  });

  // --- Pruebas para getAllProcesses ---
  describe('getAllProcesses', () => {
    it('debería llamar a processRepo.findAll con los filtros', async () => {
        const filters = { status: 'activo' };
        await processService.getAllProcesses(filters);
        expect(ProcessRepository.prototype.findAll).toHaveBeenCalledWith(filters);
      });
  });

  // --- Pruebas para existsById ---
  describe('existsById', () => {
    it('debería devolver true si el proceso existe', async () => {
        ProcessRepository.prototype.findById.mockResolvedValue({ id: 1 });
        const result = await processService.existsById(1);
        expect(result).toBe(true);
      });
      it('debería devolver false si el proceso no existe', async () => {
        ProcessRepository.prototype.findById.mockResolvedValue(null);
        const result = await processService.existsById(1);
        expect(result).toBe(false);
      });
  });

  // --- Pruebas para métodos delegados/redundantes ---
  const simplePassthroughMethods = [
    { name: 'updateEvent', repo: 'EventRepository', repoMethod: 'update' },
    { name: 'removeEvent', repo: 'EventRepository', repoMethod: 'delete' },
    { name: 'addObservation', repo: 'ObservationRepository', repoMethod: 'create' },
    { name: 'updateObservation', repo: 'ObservationRepository', repoMethod: 'update' },
    { name: 'removeObservation', repo: 'ObservationRepository', repoMethod: 'delete' },
  ];

  simplePassthroughMethods.forEach(({ name, repo, repoMethod }) => {
    describe(name, () => {
        it(`debería llamar a ${repo}.${repoMethod}`, async () => {
            const mockData = { id: 1 };
            // La magia está aquí: seleccionamos el prototipo del repo dinámicamente
            const Repositories = { EventRepository, ObservationRepository };
            Repositories[repo].prototype[repoMethod].mockResolvedValue(mockData);

            const result = await processService[name](mockData);

            expect(Repositories[repo].prototype[repoMethod]).toHaveBeenCalledWith(mockData);
            expect(result).toEqual(mockData);
        });
    });
  });

  // Prueba específica para addEvent por su lógica más compleja
  describe('addEvent', () => {
    it('debería crear un evento y actualizar el timeline', async () => {
        const timelineId = 1;
        const eventData = { process_id: 10, name: 'Test' };
        const mockTimeline = { timeline_id: timelineId, number_events: 5 };

        EventRepository.prototype.create.mockResolvedValue({ id: 1, ...eventData });
        TimelineRepository.prototype.findByProcessId.mockResolvedValue(mockTimeline);
        TimelineRepository.prototype.update.mockResolvedValue({});

        await processService.addEvent(timelineId, eventData);

        expect(EventRepository.prototype.create).toHaveBeenCalledWith({ ...eventData, timeline_id: timelineId });
        expect(TimelineRepository.prototype.update).toHaveBeenCalledWith({
            timeline_id: timelineId,
            number_events: mockTimeline.number_events + 1
        });
    });
  });
});
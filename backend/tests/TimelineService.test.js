// tests/TimelineService.test.js

import { TimelineService } from '../src/services/TimelineService.js';
import { TimelineRepository } from '../src/repositories/TimelineRepository.js';
import { EventRepository } from '../src/repositories/EventRepository.js';
import { ProcessRepository } from '../src/repositories/ProcessRepository.js';

// Mockeamos todos los repositorios para tener control total y aislar el servicio.
jest.mock('../src/repositories/TimelineRepository.js');
jest.mock('../src/repositories/EventRepository.js');
jest.mock('../src/repositories/ProcessRepository.js');

describe('TimelineService', () => {
  let timelineService;
  const accountId = 1;

  beforeEach(() => {
    timelineService = new TimelineService();
    jest.clearAllMocks();
  });

  // --- Pruebas para createTimeline ---
  describe('createTimeline', () => {
    it('debería crear un timeline si el proceso existe y no tiene timeline previo', async () => {
      const timelineData = { process_id: 10 };
      ProcessRepository.prototype.findById.mockResolvedValue({ account_id: accountId });
      TimelineRepository.prototype.findById.mockResolvedValue(null); // No existe timeline previo
      TimelineRepository.prototype.create.mockResolvedValue({ timeline_id: 1, ...timelineData });

      const result = await timelineService.createTimeline(timelineData, accountId);
      expect(result).toBeDefined();
      expect(TimelineRepository.prototype.create).toHaveBeenCalledWith(timelineData);
    });

    it('debería lanzar error "Proceso no encontrado"', async () => {
      ProcessRepository.prototype.findById.mockResolvedValue(null);
      await expect(timelineService.createTimeline({ process_id: 99 }, accountId))
        .rejects.toThrow('Proceso no encontrado');
    });

    it('debería lanzar error "No autorizado"', async () => {
      ProcessRepository.prototype.findById.mockResolvedValue({ account_id: 99 }); // Otro usuario
      await expect(timelineService.createTimeline({ process_id: 10 }, accountId))
        .rejects.toThrow('No autorizado para crear timeline en este proceso');
    });

    it('debería lanzar error si ya existe un timeline para el proceso', async () => {
      ProcessRepository.prototype.findById.mockResolvedValue({ account_id: accountId });
      TimelineRepository.prototype.findById.mockResolvedValue({ timeline_id: 1 }); // Ya existe
      await expect(timelineService.createTimeline({ process_id: 10 }, accountId))
        .rejects.toThrow('Ya existe un timeline para este proceso');
    });
  });

  // --- Pruebas para addEvent ---
  describe('addEvent', () => {
    it('debería añadir un evento y actualizar el contador del timeline', async () => {
      const eventData = { timeline_id: 1, event_title: 'Test', description: 'Desc', account_id: accountId };
      TimelineRepository.prototype.findById.mockResolvedValue({ timeline_id: 1, process_id: 10, number_events: 5 });
      ProcessRepository.prototype.findById.mockResolvedValue({ account_id: accountId });
      EventRepository.prototype.create.mockResolvedValue({ event_id: 101 });
      
      await timelineService.addEvent(eventData);

      expect(EventRepository.prototype.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'Test', order: 6 }));
      expect(TimelineRepository.prototype.update).toHaveBeenCalledWith({ timeline_id: 1, number_events: 6 });
    });

    it('debería lanzar error si el timeline no existe', async () => {
        TimelineRepository.prototype.findById.mockResolvedValue(null);
        await expect(timelineService.addEvent({})).rejects.toThrow('Timeline no encontrado');
    });
    
    it('debería lanzar error si el usuario no tiene permisos sobre el timeline', async () => {
        TimelineRepository.prototype.findById.mockResolvedValue({ process_id: 10 });
        ProcessRepository.prototype.findById.mockResolvedValue({ account_id: 99 }); // Otro usuario
        await expect(timelineService.addEvent({ account_id: accountId })).rejects.toThrow('No tienes permiso para agregar eventos a este timeline');
    });
  });

  // --- Pruebas para modifyEvent ---
  describe('modifyEvent', () => {
    it('debería modificar un evento correctamente', async () => {
      const eventData = { event_id: 101, event_title: 'Updated' };
      EventRepository.prototype.findById.mockResolvedValue({ event_id: 101, timeline_id: 1 });
      TimelineRepository.prototype.findById.mockResolvedValue({ timeline_id: 1, process_id: 10 });
      ProcessRepository.prototype.findById.mockResolvedValue({ account_id: accountId });
      EventRepository.prototype.updatePartial.mockResolvedValue({});

      await timelineService.modifyEvent(eventData, accountId);
      expect(EventRepository.prototype.updatePartial).toHaveBeenCalledWith(expect.objectContaining({ name: 'Updated' }));
    });

    it('debería lanzar error si el evento a modificar no existe', async () => {
        EventRepository.prototype.findById.mockResolvedValue(null);
        await expect(timelineService.modifyEvent({}, accountId)).rejects.toThrow('Evento no encontrado');
    });
  });

  // --- Pruebas para removeEvent ---
  describe('removeEvent', () => {
    it('debería eliminar, decrementar y reordenar', async () => {
      const eventId = 101;
      EventRepository.prototype.findById.mockResolvedValue({ event_id: eventId, timeline_id: 1 });
      TimelineRepository.prototype.findById.mockResolvedValue({ timeline_id: 1, process_id: 10 });
      ProcessRepository.prototype.findById.mockResolvedValue({ account_id: accountId });
      
      await timelineService.removeEvent(eventId, accountId);

      expect(EventRepository.prototype.delete).toHaveBeenCalledWith(eventId);
      expect(TimelineRepository.prototype.decrementEventCount).toHaveBeenCalledWith(1);
      expect(EventRepository.prototype.reorderTimelineEvents).toHaveBeenCalledWith(1);
    });

    it('debería lanzar error si el evento a eliminar no existe', async () => {
        EventRepository.prototype.findById.mockResolvedValue(null);
        await expect(timelineService.removeEvent(999, accountId)).rejects.toThrow('Evento no encontrado');
    });
  });

  // --- Pruebas para deleteTimeline ---
  describe('deleteTimeline', () => {
    it('debería eliminar un timeline si pertenece al usuario', async () => {
      const timelineId = 1;
      TimelineRepository.prototype.findById.mockResolvedValue({ timeline_id: timelineId, process_id: 10 });
      ProcessRepository.prototype.findById.mockResolvedValue({ account_id: accountId });
      
      await timelineService.deleteTimeline(timelineId, accountId);

      expect(TimelineRepository.prototype.deleteTimeline).toHaveBeenCalledWith(timelineId);
    });

    it('debería lanzar error si el usuario no tiene permisos para eliminar', async () => {
        const timelineId = 1;
        TimelineRepository.prototype.findById.mockResolvedValue({ timeline_id: timelineId, process_id: 10 });
        ProcessRepository.prototype.findById.mockResolvedValue({ account_id: 99 }); // Otro usuario
        
        await expect(timelineService.deleteTimeline(timelineId, accountId)).rejects.toThrow('No tienes permiso para eliminar este timeline');
    });
  });

  // --- Pruebas para getTimelineByProcessId ---
  describe('getTimelineByProcessId', () => {
    it('debería llamar al repositorio y devolver el timeline', async () => {
      const processId = 1;
      const mockTimeline = { timeline_id: 1, process_id: processId };
      TimelineRepository.prototype.findByProcessId.mockResolvedValue(mockTimeline);
      
      const result = await timelineService.getTimelineByProcessId(processId);

      expect(TimelineRepository.prototype.findByProcessId).toHaveBeenCalledWith(processId);
      expect(result).toEqual(mockTimeline);
    });
  });
});
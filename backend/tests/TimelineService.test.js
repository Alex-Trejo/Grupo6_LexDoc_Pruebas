// tests/TimelineService.test.js

import { TimelineService } from '../src/services/TimelineService.js';
import { TimelineRepository } from '../src/repositories/TimelineRepository.js';
import { EventRepository } from '../src/repositories/EventRepository.js';
import { ProcessRepository } from '../src/repositories/ProcessRepository.js';

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
      TimelineRepository.prototype.findById.mockResolvedValue(null);
      TimelineRepository.prototype.create.mockResolvedValue({ timeline_id: 1, ...timelineData });
      const result = await timelineService.createTimeline(timelineData, accountId);
      expect(result).toBeDefined();
    });

    it('debería lanzar error "Proceso no encontrado"', async () => {
      ProcessRepository.prototype.findById.mockResolvedValue(null);
      await expect(timelineService.createTimeline({ process_id: 99 }, accountId)).rejects.toThrow('Proceso no encontrado');
    });

    it('debería lanzar error "No autorizado"', async () => {
      ProcessRepository.prototype.findById.mockResolvedValue({ account_id: 99 });
      await expect(timelineService.createTimeline({ process_id: 10 }, accountId)).rejects.toThrow('No autorizado para crear timeline en este proceso');
    });

    it('debería lanzar error si ya existe un timeline para el proceso', async () => {
      ProcessRepository.prototype.findById.mockResolvedValue({ account_id: accountId });
      TimelineRepository.prototype.findById.mockResolvedValue({ timeline_id: 1 });
      await expect(timelineService.createTimeline({ process_id: 10 }, accountId)).rejects.toThrow('Ya existe un timeline para este proceso');
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
      expect(EventRepository.prototype.create).toHaveBeenCalled();
      expect(TimelineRepository.prototype.update).toHaveBeenCalled();
    });

    it('debería lanzar error si el timeline no existe', async () => {
        TimelineRepository.prototype.findById.mockResolvedValue(null);
        await expect(timelineService.addEvent({})).rejects.toThrow('Timeline no encontrado');
    });
    
    it('debería lanzar error si el usuario no tiene permisos sobre el timeline', async () => {
        TimelineRepository.prototype.findById.mockResolvedValue({ process_id: 10 });
        ProcessRepository.prototype.findById.mockResolvedValue({ account_id: 99 });
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
      expect(EventRepository.prototype.updatePartial).toHaveBeenCalled();
    });

    it('debería lanzar error si el evento a modificar no existe', async () => {
        EventRepository.prototype.findById.mockResolvedValue(null);
        await expect(timelineService.modifyEvent({}, accountId)).rejects.toThrow('Evento no encontrado');
    });

    // ✅ PRUEBA AÑADIDA PARA CUBRIR LA LÍNEA 75
    it('debería lanzar error si el timeline del evento no se encuentra', async () => {
        EventRepository.prototype.findById.mockResolvedValue({ event_id: 101, timeline_id: 1 });
        TimelineRepository.prototype.findById.mockResolvedValue(null); // Timeline no encontrado
        await expect(timelineService.modifyEvent({ event_id: 101 }, accountId)).rejects.toThrow('Timeline no encontrado');
    });

    // ✅ PRUEBA AÑADIDA PARA CUBRIR LA LÍNEA 81
    it('debería lanzar error si el proceso del timeline no pertenece al usuario', async () => {
        EventRepository.prototype.findById.mockResolvedValue({ event_id: 101, timeline_id: 1 });
        TimelineRepository.prototype.findById.mockResolvedValue({ timeline_id: 1, process_id: 10 });
        ProcessRepository.prototype.findById.mockResolvedValue({ account_id: 99 }); // Otro usuario
        await expect(timelineService.modifyEvent({ event_id: 101 }, accountId)).rejects.toThrow('No tienes permiso para modificar este evento');
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
      expect(EventRepository.prototype.delete).toHaveBeenCalled();
      expect(TimelineRepository.prototype.decrementEventCount).toHaveBeenCalled();
      expect(EventRepository.prototype.reorderTimelineEvents).toHaveBeenCalled();
    });

    it('debería lanzar error si el evento a eliminar no existe', async () => {
        EventRepository.prototype.findById.mockResolvedValue(null);
        await expect(timelineService.removeEvent(999, accountId)).rejects.toThrow('Evento no encontrado');
    });

    // ✅ PRUEBA AÑADIDA PARA CUBRIR LA LÍNEA 110
   it('debería lanzar error si no tiene permiso para eliminar el evento', async () => {
        EventRepository.prototype.findById.mockResolvedValue({ timeline_id: 1 });
        TimelineRepository.prototype.findById.mockResolvedValue({ process_id: 10 });
        ProcessRepository.prototype.findById.mockResolvedValue({ account_id: 99 }); // Proceso de otro usuario
        await expect(timelineService.removeEvent(101, accountId)).rejects.toThrow('No tienes permiso para eliminar este evento');
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
        ProcessRepository.prototype.findById.mockResolvedValue({ account_id: 99 });
        await expect(timelineService.deleteTimeline(timelineId, accountId)).rejects.toThrow('No tienes permiso para eliminar este timeline');
    });

    // ✅ PRUEBA AÑADIDA PARA CUBRIR LA LÍNEA 129
     it('debería lanzar error si el timeline a eliminar no se encuentra', async () => {
        const timelineId = 1;
        // Simulamos que el timeline no se encuentra desde el principio.
        TimelineRepository.prototype.findById.mockResolvedValue(null);
        await expect(timelineService.deleteTimeline(timelineId, accountId)).rejects.toThrow('Timeline no encontrado');
        // Verificamos que no se intenta buscar el proceso si no se encontró el timeline.
        expect(ProcessRepository.prototype.findById).not.toHaveBeenCalled();
    });
  });

  // --- Pruebas para getTimelineByProcessId ---
  describe('getTimelineByProcessId', () => {
    it('debería llamar al repositorio y devolver el timeline', async () => {
      const processId = 1;
      const mockTimeline = { timeline_id: 1, process_id: processId };
      TimelineRepository.prototype.findByProcessId.mockResolvedValue(mockTimeline);
      const result = await timelineService.getTimelineByProcessId(processId);
      expect(result).toEqual(mockTimeline);
    });
  });
});
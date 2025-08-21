// tests/TimelineController.test.js

import { TimelineController } from '../src/controllers/TimelineController.js';
import { TimelineService } from '../src/services/TimelineService.js';
import { ProcessService } from '../src/services/ProcessService.js';

// "Mockeamos" ambos servicios de los que depende el controlador.
// Esto nos da control total sobre su comportamiento durante las pruebas.
jest.mock('../src/services/TimelineService.js');
jest.mock('../src/services/ProcessService.js');

describe('TimelineController', () => {
  let timelineController;
  let mockRequest;
  let mockResponse;

  // Antes de cada prueba, creamos un entorno limpio.
  beforeEach(() => {
    timelineController = new TimelineController();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    // Simulamos un usuario autenticado para todos los métodos.
    mockRequest = {
      user: { id: 1 },
      body: {},
      params: {},
    };
    jest.clearAllMocks();
  });

  // --- Pruebas para el método createTimeline ---
  describe('createTimeline', () => {
    it('debería crear un timeline y devolver 201', async () => {
      mockRequest.body = { process_id: 10 };
      const mockResult = { timeline_id: 1, process_id: 10 };
      TimelineService.prototype.createTimeline.mockResolvedValue(mockResult);

      await timelineController.createTimeline(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
      expect(TimelineService.prototype.createTimeline).toHaveBeenCalledWith({ process_id: 10 }, 1);
    });

    it('debería devolver 403 si el servicio indica "No autorizado"', async () => {
      const errorMessage = 'No autorizado para crear timeline en este proceso';
      TimelineService.prototype.createTimeline.mockRejectedValue(new Error(errorMessage));
      await timelineController.createTimeline(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    });

    it('debería devolver 404 si el servicio indica "Proceso no encontrado"', async () => {
      const errorMessage = 'Proceso no encontrado';
      TimelineService.prototype.createTimeline.mockRejectedValue(new Error(errorMessage));
      await timelineController.createTimeline(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    });

    it('debería devolver 400 para otros errores', async () => {
      const errorMessage = 'Otro error';
      TimelineService.prototype.createTimeline.mockRejectedValue(new Error(errorMessage));
      await timelineController.createTimeline(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  // --- Pruebas para el método addEvent ---
  describe('addEvent', () => {
    it('debería añadir un evento y devolver 201', async () => {
      mockRequest.params = { timeline_id: '1' };
      mockRequest.body = { name: 'Audiencia', description: 'Detalle' };
      const mockResult = { event_id: 101, ...mockRequest.body };
      TimelineService.prototype.addEvent.mockResolvedValue(mockResult);

      await timelineController.addEvent(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('debería devolver 400 si el servicio falla', async () => {
      const errorMessage = 'Error al añadir evento';
      TimelineService.prototype.addEvent.mockRejectedValue(new Error(errorMessage));
      await timelineController.addEvent(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  // --- Pruebas para el método removeEvent ---
  describe('removeEvent', () => {
    it('debería eliminar un evento y devolver 200', async () => {
      mockRequest.params = { event_id: '101' };
      TimelineService.prototype.removeEvent.mockResolvedValue();
      await timelineController.removeEvent(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Eliminación de evento con éxito' });
    });

    it('debería devolver 404 si el evento no se encuentra', async () => {
      const errorMessage = 'Evento no encontrado';
      TimelineService.prototype.removeEvent.mockRejectedValue(new Error(errorMessage));
      await timelineController.removeEvent(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it('debería devolver 403 si el usuario no tiene permisos', async () => {
      const errorMessage = 'No tienes permiso para eliminar este evento';
      TimelineService.prototype.removeEvent.mockRejectedValue(new Error(errorMessage));
      await timelineController.removeEvent(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });
  });

  // --- Pruebas para el método deleteTimeline ---
  describe('deleteTimeline', () => {
    it('debería eliminar un timeline y devolver 204', async () => {
      mockRequest.params = { timeline_id: '1' };
      TimelineService.prototype.deleteTimeline.mockResolvedValue();
      await timelineController.deleteTimeline(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
    });

    it('debería devolver 404 si el timeline no se encuentra', async () => {
        const errorMessage = 'Timeline no encontrado';
        TimelineService.prototype.deleteTimeline.mockRejectedValue(new Error(errorMessage));
        await timelineController.deleteTimeline(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
      });
  });

  // --- Pruebas para el método modifyEvent ---
  describe('modifyEvent', () => {
    it('debería modificar un evento y devolver 200', async () => {
      mockRequest.body = { event_id: 101, event_title: 'Título Modificado' };
      const mockResult = { ...mockRequest.body };
      TimelineService.prototype.modifyEvent.mockResolvedValue(mockResult);
      await timelineController.modifyEvent(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('debería devolver 404 si el evento no se encuentra', async () => {
      const errorMessage = 'Evento no encontrado';
      TimelineService.prototype.modifyEvent.mockRejectedValue(new Error(errorMessage));
      await timelineController.modifyEvent(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });

  // --- Pruebas para el método getTimelineByProcess ---
  describe('getTimelineByProcess', () => {
    beforeEach(() => {
        mockRequest.params = { process_id: '10' };
    });

    it('debería obtener un timeline y devolver 200', async () => {
        const mockTimeline = { timeline_id: 1, process_id: 10 };
        // La validación del proceso tiene éxito
        ProcessService.prototype.getProcessById.mockResolvedValue({ id: 10 });
        // La obtención del timeline tiene éxito
        TimelineService.prototype.getTimelineByProcessId.mockResolvedValue(mockTimeline);
        
        await timelineController.getTimelineByProcess(mockRequest, mockResponse);

        expect(ProcessService.prototype.getProcessById).toHaveBeenCalledWith('10', 1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockTimeline);
    });

    it('debería devolver 404 si el timeline no se encuentra pero el proceso sí', async () => {
        ProcessService.prototype.getProcessById.mockResolvedValue({ id: 10 });
        // El timeline no se encuentra
        TimelineService.prototype.getTimelineByProcessId.mockResolvedValue(null);
        await timelineController.getTimelineByProcess(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Timeline no encontrado' });
    });

    it('debería devolver 403 si el acceso al proceso no está autorizado', async () => {
        const errorMessage = 'Unauthorized access to this process';
        ProcessService.prototype.getProcessById.mockRejectedValue(new Error(errorMessage));
        await timelineController.getTimelineByProcess(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(403);
    });
    
    it('debería devolver 404 si el proceso no se encuentra', async () => {
        const errorMessage = 'Process not found';
        ProcessService.prototype.getProcessById.mockRejectedValue(new Error(errorMessage));
        await timelineController.getTimelineByProcess(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });
});
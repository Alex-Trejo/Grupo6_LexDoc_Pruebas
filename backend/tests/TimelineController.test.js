// tests/TimelineController.test.js

import { TimelineController } from '../src/controllers/TimelineController.js';
import { TimelineService } from '../src/services/TimelineService.js';
import { ProcessService } from '../src/services/ProcessService.js';

jest.mock('../src/services/TimelineService.js');
jest.mock('../src/services/ProcessService.js');

describe('TimelineController', () => {
  let timelineController;
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    timelineController = new TimelineController();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    mockRequest = { user: { id: 1 }, body: {}, params: {} };
    jest.clearAllMocks();
  });

  // --- Pruebas para createTimeline ---
  describe('createTimeline', () => {
    // ✅ PRUEBAS REFINADAS PARA CUBRIR LÍNEAS 15-21
    it('debería crear un timeline y devolver 201', async () => {
      mockRequest.body = { process_id: 1 };
      TimelineService.prototype.createTimeline.mockResolvedValue({ id: 1 });
      await timelineController.createTimeline(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ id: 1 });
    });
    it('debería devolver 403 por no estar autorizado', async () => {
      TimelineService.prototype.createTimeline.mockRejectedValue(new Error('No autorizado para crear timeline en este proceso'));
      await timelineController.createTimeline(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });
    it('debería devolver 404 si el proceso no se encuentra', async () => {
      TimelineService.prototype.createTimeline.mockRejectedValue(new Error('Proceso no encontrado'));
      await timelineController.createTimeline(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
    it('debería devolver 400 para otros errores', async () => {
      TimelineService.prototype.createTimeline.mockRejectedValue(new Error('Generic Error'));
      await timelineController.createTimeline(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  // --- Pruebas para addEvent ---
  describe('addEvent', () => {
    it('debería añadir un evento y devolver 201', async () => {
      TimelineService.prototype.addEvent.mockResolvedValue({ id: 1 });
      await timelineController.addEvent(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });
    // ✅ PRUEBA AÑADIDA PARA CUBRIR LA LÍNEA 41
    it('debería devolver 400 si el servicio falla', async () => {
      TimelineService.prototype.addEvent.mockRejectedValue(new Error('Service Error'));
      await timelineController.addEvent(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Service Error' });
    });
  });

  // --- Pruebas para removeEvent ---
  describe('removeEvent', () => {
    beforeEach(() => { mockRequest.params = { event_id: '101' }; });
    it('debería eliminar un evento y devolver 200', async () => {
      TimelineService.prototype.removeEvent.mockResolvedValue();
      await timelineController.removeEvent(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
    it('debería devolver 404 si el evento no se encuentra', async () => {
      TimelineService.prototype.removeEvent.mockRejectedValue(new Error('Evento no encontrado'));
      await timelineController.removeEvent(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
    it('debería devolver 403 si no tiene permisos', async () => {
      TimelineService.prototype.removeEvent.mockRejectedValue(new Error('No tienes permiso para eliminar este evento'));
      await timelineController.removeEvent(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });
    it('debería devolver 400 para otros errores', async () => {
      TimelineService.prototype.removeEvent.mockRejectedValue(new Error('DB Error'));
      await timelineController.removeEvent(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  // --- Pruebas para deleteTimeline ---
  describe('deleteTimeline', () => {
    beforeEach(() => { mockRequest.params = { timeline_id: '1' }; });
    it('debería eliminar un timeline y devolver 204', async () => {
      TimelineService.prototype.deleteTimeline.mockResolvedValue();
      await timelineController.deleteTimeline(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
    });
    it('debería devolver 404 si el timeline no se encuentra', async () => {
      TimelineService.prototype.deleteTimeline.mockRejectedValue(new Error('Timeline no encontrado'));
      await timelineController.deleteTimeline(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
    it('debería devolver 403 si no tiene permisos', async () => {
      TimelineService.prototype.deleteTimeline.mockRejectedValue(new Error('No tienes permiso para eliminar este timeline'));
      await timelineController.deleteTimeline(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });
    // ✅ PRUEBA AÑADIDA PARA CUBRIR LA LÍNEA 77
    it('debería devolver 400 para otros errores', async () => {
        TimelineService.prototype.deleteTimeline.mockRejectedValue(new Error('Generic Error'));
        await timelineController.deleteTimeline(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Generic Error' });
      });
  });

  // --- Pruebas para modifyEvent ---
  describe('modifyEvent', () => {
    it('debería modificar un evento y devolver 200', async () => {
      TimelineService.prototype.modifyEvent.mockResolvedValue({});
      await timelineController.modifyEvent(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
    it('debería devolver 404 si el evento no se encuentra', async () => {
      TimelineService.prototype.modifyEvent.mockRejectedValue(new Error('Evento no encontrado'));
      await timelineController.modifyEvent(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
    it('debería devolver 400 para otros errores', async () => {
      TimelineService.prototype.modifyEvent.mockRejectedValue(new Error('Generic Error'));
      await timelineController.modifyEvent(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  // --- Pruebas para getTimelineByProcess ---
  describe('getTimelineByProcess', () => {
    beforeEach(() => { mockRequest.params = { process_id: '10' }; });
    it('debería obtener un timeline y devolver 200', async () => {
      ProcessService.prototype.getProcessById.mockResolvedValue({});
      TimelineService.prototype.getTimelineByProcessId.mockResolvedValue({});
      await timelineController.getTimelineByProcess(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
    it('debería devolver 404 si el timeline no se encuentra', async () => {
      ProcessService.prototype.getProcessById.mockResolvedValue({});
      TimelineService.prototype.getTimelineByProcessId.mockResolvedValue(null);
      await timelineController.getTimelineByProcess(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
    it('debería devolver 403 por acceso no autorizado', async () => {
      ProcessService.prototype.getProcessById.mockRejectedValue(new Error('Unauthorized access to this process'));
      await timelineController.getTimelineByProcess(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });
    it('debería devolver 404 si el proceso no se encuentra', async () => {
      ProcessService.prototype.getProcessById.mockRejectedValue(new Error('Process not found'));
      await timelineController.getTimelineByProcess(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
    it('debería devolver 400 para otros errores', async () => {
      ProcessService.prototype.getProcessById.mockRejectedValue(new Error('Generic Error'));
      await timelineController.getTimelineByProcess(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });
});
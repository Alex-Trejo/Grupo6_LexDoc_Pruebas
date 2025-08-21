// tests/ProcessController.test.js

import { ProcessController } from '../src/controllers/ProcessController.js';
import { ProcessService } from '../src/services/ProcessService.js';

jest.mock('../src/services/ProcessService.js');

describe('ProcessController', () => {
  let processController;
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    processController = new ProcessController();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    mockRequest = { user: { id: 1 }, body: {}, params: {}, query: {} };
    jest.clearAllMocks();
  });

  // --- Pruebas para createProcess ---
  describe('createProcess', () => {
    beforeEach(() => {
        mockRequest.body = { title: 'T', type: 't', offense: 'o', denounced: 'd', denouncer: 'd', province: 'p', carton: 'c' };
    });
    it('debería crear un proceso y devolver 201', async () => {
      ProcessService.prototype.createProcess.mockResolvedValue({ id: 1 });
      await processController.createProcess(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });
    it('debería devolver 400 si faltan campos', async () => {
      mockRequest.body.title = '';
      await processController.createProcess(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
    it('debería devolver 400 por caracteres inválidos', async () => {
      mockRequest.body.denounced = 'd123';
      await processController.createProcess(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
    it('debería devolver 400 si el servicio falla', async () => {
        ProcessService.prototype.createProcess.mockRejectedValue(new Error('DB Error'));
        await processController.createProcess(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  // --- Pruebas para updateProcess ---
  describe('updateProcess', () => {
    beforeEach(() => {
        mockRequest.params = { process_id: '1' };
    });
    it('debería actualizar un proceso y devolver 200', async () => {
      ProcessService.prototype.getProcessById.mockResolvedValue({ id: 1 });
      ProcessService.prototype.updateProcess.mockResolvedValue({});
      await processController.updateProcess(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
    it('debería devolver 403 por acceso no autorizado', async () => {
      ProcessService.prototype.getProcessById.mockRejectedValue(new Error('Unauthorized access to this process'));
      await processController.updateProcess(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });
    it('debería devolver 404 si el proceso no se encuentra', async () => {
      ProcessService.prototype.getProcessById.mockRejectedValue(new Error('Process not found'));
      await processController.updateProcess(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
    it('debería devolver 400 para otros errores', async () => {
        ProcessService.prototype.getProcessById.mockRejectedValue(new Error('Generic Error'));
        await processController.updateProcess(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  // --- Pruebas para deleteProcess ---
  describe('deleteProcess', () => {
      it('debería eliminar un proceso y devolver 204', async () => {
        mockRequest.params = { process_id: '1' };
        ProcessService.prototype.getProcessById.mockResolvedValue({ account_id: 1 });
        await processController.deleteProcess(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(204);
      });
      it('debería devolver 403 si el proceso no pertenece al usuario', async () => {
        mockRequest.params = { process_id: '1' };
        ProcessService.prototype.getProcessById.mockResolvedValue({ account_id: 99 });
        await processController.deleteProcess(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(403);
      });
  });

  // --- Pruebas para los métodos GET ---
  describe('GET methods', () => {
    it('getProcessById debería devolver 404 si el servicio falla', async () => {
      mockRequest.params = { process_id: '1' };
      ProcessService.prototype.getProcessById.mockRejectedValue(new Error('Error'));
      await processController.getProcessById(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
    it('getProcessesByAccountId debería devolver 500 si el servicio falla', async () => {
      ProcessService.prototype.getProcessesByAccountId.mockRejectedValue(new Error('Error'));
      await processController.getProcessesByAccountId(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
    it('getAllProcesses debería devolver 400 si el servicio falla', async () => {
      ProcessService.prototype.getAllProcesses.mockRejectedValue(new Error('Error'));
      await processController.getAllProcesses(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  // --- Pruebas para métodos delegados/redundantes ---
  // ✅ ARRAY CORREGIDO: Solo incluye los métodos que SÍ existen en ProcessService
  const delegatedMethods = [
    { name: 'addEvent', serviceMethod: 'addEvent', status: 201, httpMethod: 'json' },
    { name: 'updateEvent', serviceMethod: 'updateEvent', status: 200, httpMethod: 'json' },
    { name: 'removeEvent', serviceMethod: 'removeEvent', status: 204, httpMethod: 'send' },
    { name: 'addObservation', serviceMethod: 'addObservation', status: 201, httpMethod: 'json' },
    { name: 'updateObservation', serviceMethod: 'updateObservation', status: 200, httpMethod: 'json' },
    { name: 'removeObservation', serviceMethod: 'removeObservation', status: 204, httpMethod: 'send' },
  ];

  delegatedMethods.forEach(({ name, serviceMethod, status, httpMethod }) => {
    describe(name, () => {
      it(`debería llamar al servicio y devolver ${status}`, async () => {
        mockRequest = { params: {}, body: {} };
        const mockResult = { success: true };
        ProcessService.prototype[serviceMethod].mockResolvedValue(mockResult);
        await processController[name](mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(status);
        if (httpMethod === 'json') {
          expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
        } else {
          expect(mockResponse.send).toHaveBeenCalled();
        }
      });

      it('debería manejar errores y devolver 400', async () => {
        mockRequest = { params: {}, body: {} };
        ProcessService.prototype[serviceMethod].mockRejectedValue(new Error('Service Error'));
        await processController[name](mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
    });
  });
});
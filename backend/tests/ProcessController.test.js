// tests/ProcessController.test.js

import { ProcessController } from '../src/controllers/ProcessController.js';
import { ProcessService } from '../src/services/ProcessService.js';

// Mockeamos el servicio para controlar su comportamiento y aislar el controlador.
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
    // Simulamos un usuario autenticado para la mayoría de las pruebas.
    mockRequest = { user: { id: 1 }, body: {}, params: {}, query: {} };
    jest.clearAllMocks();
  });

  // --- Pruebas para el método createProcess ---
  describe('createProcess', () => {
    it('debería crear un proceso y devolver 201', async () => {
      mockRequest.body = { title: 'Test', type: 't', offense: 'o', denounced: 'd', denouncer: 'd', province: 'p', carton: 'c' };
      const mockResult = { process_id: 1, ...mockRequest.body };
      ProcessService.prototype.createProcess.mockResolvedValue(mockResult);

      await processController.createProcess(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('debería devolver 400 si faltan campos', async () => {
      mockRequest.body = { title: 'Test' };
      await processController.createProcess(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Todos los campos son obligatorios' });
    });

    it('debería devolver 400 si hay caracteres inválidos', async () => {
        mockRequest.body = { title: 'T', type: 't', offense: 'o', denounced: 'd123', denouncer: 'd', province: 'p', carton: 'c' };
        await processController.createProcess(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Los campos denounced, denouncer y province solo deben contener letras y espacios' });
      });
  });

  // --- Pruebas para el método updateProcess ---
  describe('updateProcess', () => {
    it('debería actualizar un proceso y devolver 200', async () => {
      mockRequest.params = { process_id: '1' };
      mockRequest.body = { title: 'Updated' };
      ProcessService.prototype.getProcessById.mockResolvedValue({ id: 1 });
      ProcessService.prototype.updateProcess.mockResolvedValue({ id: 1, title: 'Updated' });

      await processController.updateProcess(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Proceso actualizado correctamente' })
      );
    });

    it('debería devolver 403 por acceso no autorizado', async () => {
        mockRequest.params = { process_id: '1' };
        ProcessService.prototype.getProcessById.mockRejectedValue(new Error('Unauthorized access to this process'));
        await processController.updateProcess(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(403);
    });

    it('debería devolver 404 si el proceso no se encuentra', async () => {
        mockRequest.params = { process_id: '1' };
        ProcessService.prototype.getProcessById.mockRejectedValue(new Error('Process not found'));
        await processController.updateProcess(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });

  // --- Pruebas para el método deleteProcess ---
  describe('deleteProcess', () => {
    it('debería eliminar un proceso y devolver 204', async () => {
      mockRequest.params = { process_id: '1' };
      ProcessService.prototype.getProcessById.mockResolvedValue({ account_id: 1 });
      ProcessService.prototype.deleteProcess.mockResolvedValue();
      await processController.deleteProcess(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
    });

    it('debería devolver 403 si el proceso no pertenece al usuario', async () => {
        mockRequest.params = { process_id: '1' };
        ProcessService.prototype.getProcessById.mockResolvedValue({ account_id: 99 });
        await processController.deleteProcess(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(403);
    });

    it('debería devolver 400 si el servicio falla', async () => {
        mockRequest.params = { process_id: '1' };
        ProcessService.prototype.getProcessById.mockRejectedValue(new Error('DB Error'));
        await processController.deleteProcess(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  // --- Pruebas para los métodos GET ---
  describe('GET methods', () => {
    it('getProcessById debería devolver un proceso', async () => {
        mockRequest.params = { process_id: '1' };
        ProcessService.prototype.getProcessById.mockResolvedValue({ id: 1 });
        await processController.getProcessById(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ id: 1 });
    });

    it('getProcessesByAccountId debería devolver una lista de procesos', async () => {
        ProcessService.prototype.getProcessesByAccountId.mockResolvedValue([{}]);
        await processController.getProcessesByAccountId(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('getAllProcesses debería devolver una lista de procesos', async () => {
        ProcessService.prototype.getAllProcesses.mockResolvedValue([{}]);
        await processController.getAllProcesses(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  // --- Pruebas para todos los métodos delegados/redundantes ---
  // Este bloque prueba todos los métodos que simplemente llaman al servicio y devuelven su resultado.
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
        // Arrange
        mockRequest = { params: { id: '1' }, body: { data: 'test' } };
        const mockResult = { success: true };
        // Verificamos que el método a mockear existe antes de configurarlo.
        if (ProcessService.prototype[serviceMethod]) {
            ProcessService.prototype[serviceMethod].mockResolvedValue(mockResult);
        }
        
        // Act
        await processController[name](mockRequest, mockResponse);
        
        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(status);
        if (httpMethod === 'json') {
          expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
        } else {
          expect(mockResponse.send).toHaveBeenCalled();
        }
      });

      it('debería manejar errores y devolver 400', async () => {
        // Arrange
        mockRequest = { params: { id: '1' }, body: {} };
        const errorMessage = 'Service Error';
        if (ProcessService.prototype[serviceMethod]) {
            ProcessService.prototype[serviceMethod].mockRejectedValue(new Error(errorMessage));
        }
        
        // Act
        await processController[name](mockRequest, mockResponse);
        
        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
      });
    });
  });
});
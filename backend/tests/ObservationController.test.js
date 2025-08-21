// tests/ObservationController.test.js

import { ObservationController } from '../src/controllers/ObservationController.js';
import { ObservationService } from '../src/services/ObservationService.js';
import { ProcessService } from '../src/services/ProcessService.js';

jest.mock('../src/services/ObservationService.js');
jest.mock('../src/services/ProcessService.js');

describe('ObservationController', () => {
  let observationController;
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    observationController = new ObservationController();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // --- Pruebas para el método addObservation ---
  describe('addObservation', () => {
    beforeEach(() => {
      mockRequest = {
        user: { id: 1 },
        body: { process_id: 10, title: 'Nueva', content: 'Contenido' },
      };
    });

    it('debería añadir una observación y devolver 201', async () => {
        ProcessService.prototype.existsById.mockResolvedValue(true);
        ObservationService.prototype.createObservation.mockResolvedValue({});
        await observationController.addObservation(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(201);
      });
  
      it('debería devolver 400 si faltan campos', async () => {
        mockRequest.body = { process_id: 10 };
        await observationController.addObservation(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('debería devolver 404 si el proceso no existe', async () => {
        ProcessService.prototype.existsById.mockResolvedValue(false);
        await observationController.addObservation(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
      });
  
      it('debería devolver 403 si no está autorizado', async () => {
        ProcessService.prototype.existsById.mockResolvedValue(true);
        ObservationService.prototype.createObservation.mockRejectedValue(new Error('No autorizado'));
        await observationController.addObservation(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(403);
      });
  
      it('debería devolver 500 para otros errores', async () => {
        ProcessService.prototype.existsById.mockResolvedValue(true);
        ObservationService.prototype.createObservation.mockRejectedValue(new Error('DB Error'));
        await observationController.addObservation(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
      });
  });

  // --- Pruebas para el método modifyObservation ---
  describe('modifyObservation', () => {
    beforeEach(() => {
      mockRequest = {
        user: { id: 1 },
        body: { observation_id: 101, title: 'Título', content: 'Contenido' },
      };
    });
    // ... tus pruebas existentes para modifyObservation
    it('debería modificar una observación y devolver 200', async () => {
        ObservationService.prototype.modifyObservation.mockResolvedValue({});
        await observationController.modifyObservation(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
      });
  
      it('debería devolver 404 si la observación no se encuentra', async () => {
        ObservationService.prototype.modifyObservation.mockRejectedValue(new Error('Observación no encontrada'));
        await observationController.modifyObservation(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
      });
  
      it('debería devolver 403 si no está autorizado', async () => {
        ObservationService.prototype.modifyObservation.mockRejectedValue(new Error('No autorizado'));
        await observationController.modifyObservation(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(403);
      });

  

    it('debería devolver 400 si faltan campos requeridos', async () => {
      // Esta prueba cubre la línea 42
      mockRequest.body = { observation_id: 101 }; // Faltan title y content
      await observationController.modifyObservation(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Faltan campos requeridos' });
      expect(ObservationService.prototype.modifyObservation).not.toHaveBeenCalled();
    });

    it('debería devolver 500 para otros errores del servicio', async () => {
      // Esta prueba cubre la línea 60
      const errorMessage = 'Error genérico de base de datos';
      ObservationService.prototype.modifyObservation.mockRejectedValue(new Error(errorMessage));
      await observationController.modifyObservation(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error al modificar la observación' });
    });
  });

  // --- Pruebas para el método deleteObservation ---
  describe('deleteObservation', () => {
    beforeEach(() => {
      mockRequest = { user: { id: 1 }, params: { observation_id: '101' } };
    });

    it('debería eliminar una observación y devolver 204', async () => {
        ObservationService.prototype.deleteObservation.mockResolvedValue();
        await observationController.deleteObservation(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(204);
      });
  
      it('debería devolver 404 si no se encuentra', async () => {
        ObservationService.prototype.deleteObservation.mockRejectedValue(new Error('Observación no encontrada'));
        await observationController.deleteObservation(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
      });

    
    it('debería devolver 403 si el usuario no está autorizado', async () => {
      
      const errorMessage = 'No autorizado';
      ObservationService.prototype.deleteObservation.mockRejectedValue(new Error(errorMessage));
      await observationController.deleteObservation(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  // --- Pruebas para el método getObservationsByProcess ---
  describe('getObservationsByProcess', () => {
    beforeEach(() => {
      mockRequest = { params: { process_id: '10' } };
    });
    // ... tus pruebas existentes para getObservationsByProcess
    it('debería obtener las observaciones y devolver 200', async () => {
        ProcessService.prototype.existsById.mockResolvedValue(true);
        ObservationService.prototype.getObservationsByProcessId.mockResolvedValue([]);
        await observationController.getObservationsByProcess(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
      });
  
      it('debería devolver 404 si el proceso no existe', async () => {
        ProcessService.prototype.existsById.mockResolvedValue(false);
        await observationController.getObservationsByProcess(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
      });
  
      it('debería devolver 500 si el servicio falla', async () => {
        ProcessService.prototype.existsById.mockRejectedValue(new Error('DB Error'));
        await observationController.getObservationsByProcess(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
      });
    
    it('debería devolver 400 si falta process_id', async () => {
      // Esta prueba cubre la línea 99
      mockRequest.params = {}; // Sin process_id
      await observationController.getObservationsByProcess(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Falta process_id' });
    });
  });
});
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

  // Creamos un entorno limpio para cada prueba.
  beforeEach(() => {
    observationController = new ObservationController();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    // Muy importante para que el mock de un test no afecte a otro.
    jest.clearAllMocks();
  });

  // --- Pruebas para el método addObservation ---
  describe('addObservation', () => {
    // Para este método, simulamos un usuario autenticado.
    beforeEach(() => {
      mockRequest = {
        user: { id: 1 }, // Simula req.user del middleware de autenticación
        body: {
          process_id: 10,
          title: 'Nueva Observación',
          content: 'Detalles de la observación.',
        },
      };
    });

    it('debería añadir una observación y devolver 201', async () => {
      // Arrange
      const mockCreatedObservation = { id: 101, ...mockRequest.body };
      // El proceso existe
      ProcessService.prototype.existsById.mockResolvedValue(true);
      // La creación de la observación es exitosa
      ObservationService.prototype.createObservation.mockResolvedValue(mockCreatedObservation);

      // Act
      await observationController.addObservation(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCreatedObservation);
      expect(ProcessService.prototype.existsById).toHaveBeenCalledWith(10);
      expect(ObservationService.prototype.createObservation).toHaveBeenCalledWith(
        { process_id: 10, title: 'Nueva Observación', content: 'Detalles de la observación.' },
        1 // account_id del usuario mock
      );
    });

    it('debería devolver 400 si faltan campos requeridos', async () => {
      mockRequest.body = { process_id: 10 }; // Faltan title y content
      await observationController.addObservation(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Faltan campos requeridos' });
      expect(ProcessService.prototype.existsById).not.toHaveBeenCalled();
    });

    it('debería devolver 404 si el proceso no existe', async () => {
      ProcessService.prototype.existsById.mockResolvedValue(false);
      await observationController.addObservation(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Proceso no encontrado' });
    });

    it('debería devolver 403 si el servicio indica "No autorizado"', async () => {
      ProcessService.prototype.existsById.mockResolvedValue(true);
      const errorMessage = 'No autorizado';
      ObservationService.prototype.createObservation.mockRejectedValue(new Error(errorMessage));
      await observationController.addObservation(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    });

    it('debería devolver 500 para cualquier otro error del servicio', async () => {
        ProcessService.prototype.existsById.mockResolvedValue(true);
        const errorMessage = 'Error de base de datos';
        ObservationService.prototype.createObservation.mockRejectedValue(new Error(errorMessage));
        await observationController.addObservation(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error al crear la observación' });
    });
  });

  // --- Pruebas para el método modifyObservation ---
  describe('modifyObservation', () => {
    beforeEach(() => {
        mockRequest = {
            user: { id: 1 },
            body: { observation_id: 101, title: 'Título actualizado', content: 'Contenido actualizado' },
        };
    });

    it('debería modificar una observación y devolver 200', async () => {
        const mockUpdatedObservation = { id: 101, ...mockRequest.body };
        ObservationService.prototype.modifyObservation.mockResolvedValue(mockUpdatedObservation);
        await observationController.modifyObservation(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedObservation);
    });

    it('debería devolver 404 si la observación no se encuentra', async () => {
        const errorMessage = 'Observación no encontrada';
        ObservationService.prototype.modifyObservation.mockRejectedValue(new Error(errorMessage));
        await observationController.modifyObservation(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    });

    it('debería devolver 403 si el usuario no está autorizado', async () => {
        const errorMessage = 'No autorizado';
        ObservationService.prototype.modifyObservation.mockRejectedValue(new Error(errorMessage));
        await observationController.modifyObservation(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
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
        expect(mockResponse.send).toHaveBeenCalledTimes(1);
    });

    it('debería devolver 400 si falta observation_id', async () => {
        mockRequest.params.observation_id = null;
        await observationController.deleteObservation(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Falta observation_id' });
    });

    it('debería devolver 404 si la observación no se encuentra al eliminar', async () => {
        const errorMessage = 'Observación no encontrada';
        ObservationService.prototype.deleteObservation.mockRejectedValue(new Error(errorMessage));
        await observationController.deleteObservation(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  // --- Pruebas para el método getObservationsByProcess ---
  describe('getObservationsByProcess', () => {
    beforeEach(() => {
        mockRequest = { params: { process_id: '10' } };
    });

    it('debería obtener las observaciones y devolver 200', async () => {
        const mockObservations = [{ id: 1, content: 'Observación 1' }];
        ProcessService.prototype.existsById.mockResolvedValue(true);
        ObservationService.prototype.getObservationsByProcessId.mockResolvedValue(mockObservations);
        await observationController.getObservationsByProcess(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockObservations);
    });
    
    it('debería devolver una lista vacía con 200 si no hay observaciones', async () => {
        ProcessService.prototype.existsById.mockResolvedValue(true);
        ObservationService.prototype.getObservationsByProcessId.mockResolvedValue([]);
        await observationController.getObservationsByProcess(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith([]);
    });

    it('debería devolver 404 si el proceso no existe', async () => {
        ProcessService.prototype.existsById.mockResolvedValue(false);
        await observationController.getObservationsByProcess(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Proceso no encontrado' });
        expect(ObservationService.prototype.getObservationsByProcessId).not.toHaveBeenCalled();
    });

    it('debería devolver 500 si el servicio lanza un error inesperado', async () => {
        const errorMessage = 'Error de base de datos';
        ProcessService.prototype.existsById.mockRejectedValue(new Error(errorMessage));
        await observationController.getObservationsByProcess(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error al obtener las observaciones' });
    });
  });
});
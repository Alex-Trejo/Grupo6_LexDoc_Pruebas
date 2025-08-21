// tests/EventController.test.js

// Importamos la clase que vamos a probar y el servicio que vamos a "mockear".
import { EventController } from '../src/controllers/EventController.js';
import { EventService } from '../src/services/EventService.js';

jest.mock('../src/services/EventService.js');

describe('EventController', () => {
  let eventController;
  let mockRequest;
  let mockResponse;

  // Se ejecuta antes de cada test ("it" block) para asegurar un entorno limpio.
  beforeEach(() => {
    eventController = new EventController();
    mockResponse = {
      status: jest.fn().mockReturnThis(), // Permite encadenar res.status().json()
      json: jest.fn(),
      send: jest.fn(), // Necesario para el método deleteEvent que usa .send()
    };
    // Limpiamos cualquier configuración o contador de llamadas de mocks anteriores.
    jest.clearAllMocks();
  });

  // --- Pruebas para el método createEvent ---
  describe('createEvent', () => {
    it('debería crear un evento exitosamente y devolver 201', async () => {
      // Arrange: Preparamos los datos y el comportamiento del mock.
      mockRequest = {
        body: { name: 'Audiencia Inicial', timeline_id: 1 },
      };
      const mockCreatedEvent = { id: 101, ...mockRequest.body };

      // Configuramos el mock para que devuelva un valor exitoso.
      EventService.prototype.createEvent.mockResolvedValue(mockCreatedEvent);
      
      // Act: Ejecutamos el método del controlador.
      await eventController.createEvent(mockRequest, mockResponse);
        
      // Assert: Verificamos que todo ocurrió como se esperaba.
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCreatedEvent);
      expect(EventService.prototype.createEvent).toHaveBeenCalledWith(mockRequest.body);
    });

    it('debería devolver 400 si el servicio lanza un error', async () => {
      // Arrange
      mockRequest = { body: { name: 'Evento Inválido' } };
      const errorMessage = 'Error al crear el evento';
      EventService.prototype.createEvent.mockRejectedValue(new Error(errorMessage));

      // Act
      await eventController.createEvent(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  // --- Pruebas para el método updateEvent ---
  describe('updateEvent', () => {
    it('debería actualizar un evento exitosamente y devolver 200', async () => {
      // Arrange
      mockRequest = {
        body: { event_id: 101, name: 'Audiencia Inicial (Actualizada)' },
      };
      const mockUpdatedEvent = { ...mockRequest.body };
      EventService.prototype.updateEvent.mockResolvedValue(mockUpdatedEvent);
      
      // Act
      await eventController.updateEvent(mockRequest, mockResponse);
        
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedEvent);
      expect(EventService.prototype.updateEvent).toHaveBeenCalledWith(mockRequest.body);
    });

    it('debería devolver 400 si el servicio lanza un error al actualizar', async () => {
      // Arrange
      mockRequest = { body: { event_id: 999 } }; // ID de evento que no existe
      const errorMessage = 'Evento no encontrado';
      EventService.prototype.updateEvent.mockRejectedValue(new Error(errorMessage));

      // Act
      await eventController.updateEvent(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  // --- Pruebas para el método deleteEvent ---
  describe('deleteEvent', () => {
    it('debería eliminar un evento exitosamente y devolver 204', async () => {
      // Arrange
      const eventId = '101';
      mockRequest = { params: { event_id: eventId } };
      // El método del servicio no devuelve nada si tiene éxito (void).
      EventService.prototype.deleteEvent.mockResolvedValue();
      
      // Act
      await eventController.deleteEvent(mockRequest, mockResponse);
        
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalledTimes(1); // Verificamos que se usó .send()
      expect(mockResponse.json).not.toHaveBeenCalled();   // Y que no se usó .json()
      expect(EventService.prototype.deleteEvent).toHaveBeenCalledWith(eventId);
    });

    it('debería devolver 400 si el servicio lanza un error al eliminar', async () => {
      // Arrange
      const eventId = '999';
      mockRequest = { params: { event_id: eventId } };
      const errorMessage = 'No se pudo eliminar el evento';
      EventService.prototype.deleteEvent.mockRejectedValue(new Error(errorMessage));

      // Act
      await eventController.deleteEvent(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  // --- Pruebas para el método getEventsByTimeline ---
  describe('getEventsByTimeline', () => {
    it('debería obtener los eventos de un timeline y devolver 200', async () => {
      // Arrange
      const timelineId = '1';
      mockRequest = { params: { timeline_id: timelineId } };
      const mockEvents = [
        { id: 101, name: 'Evento 1' },
        { id: 102, name: 'Evento 2' },
      ];
      EventService.prototype.getEventsByTimelineId.mockResolvedValue(mockEvents);
      
      // Act
      await eventController.getEventsByTimeline(mockRequest, mockResponse);
        
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockEvents);
      expect(EventService.prototype.getEventsByTimelineId).toHaveBeenCalledWith(timelineId);
    });

    it('debería devolver 404 si el servicio lanza un error', async () => {
      // Arrange
      const timelineId = '999'; // ID de timeline que no existe
      mockRequest = { params: { timeline_id: timelineId } };
      const errorMessage = 'Timeline no encontrado';
      EventService.prototype.getEventsByTimelineId.mockRejectedValue(new Error(errorMessage));

      // Act
      await eventController.getEventsByTimeline(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
});
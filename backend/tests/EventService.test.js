// tests/EventService.test.js

import { EventService } from '../src/services/EventService.js';
import { EventRepository } from '../src/repositories/EventRepository.js';

// Mockeamos el repositorio para que el servicio no interactúe con la capa de datos real.
jest.mock('../src/repositories/EventRepository.js');

describe('EventService', () => {
  let eventService;

  beforeEach(() => {
    eventService = new EventService();
    // Limpiamos los mocks antes de cada prueba para asegurar que no hay interferencias.
    jest.clearAllMocks();
  });

  // --- Pruebas para el método createEvent ---
  describe('createEvent', () => {
    it('debería llamar a eventRepo.create y devolver el resultado', async () => {
      // Arrange
      const eventData = { name: 'Audiencia de Flagrancia', timeline_id: 1 };
      const mockCreatedEvent = { event_id: 101, ...eventData };
      
      // Configuramos el mock del repositorio para que devuelva un evento creado.
      EventRepository.prototype.create.mockResolvedValue(mockCreatedEvent);

      // Act
      const result = await eventService.createEvent(eventData);

      // Assert
      // 1. Verificamos que el método del repositorio fue llamado una vez.
      expect(EventRepository.prototype.create).toHaveBeenCalledTimes(1);
      // 2. Verificamos que fue llamado con los datos exactos que recibió el servicio.
      expect(EventRepository.prototype.create).toHaveBeenCalledWith(eventData);
      // 3. Verificamos que el servicio devolvió el resultado del repositorio.
      expect(result).toEqual(mockCreatedEvent);
    });
  });

  // --- Pruebas para el método updateEvent ---
  describe('updateEvent', () => {
    it('debería llamar a eventRepo.update y devolver el resultado', async () => {
      // Arrange
      const eventData = { event_id: 101, name: 'Audiencia Actualizada' };
      const mockUpdatedEvent = { ...eventData };
      EventRepository.prototype.update.mockResolvedValue(mockUpdatedEvent);

      // Act
      const result = await eventService.updateEvent(eventData);

      // Assert
      expect(EventRepository.prototype.update).toHaveBeenCalledTimes(1);
      expect(EventRepository.prototype.update).toHaveBeenCalledWith(eventData);
      expect(result).toEqual(mockUpdatedEvent);
    });
  });

  // --- Pruebas para el método deleteEvent ---
  describe('deleteEvent', () => {
    it('debería llamar a eventRepo.delete con el event_id correcto', async () => {
      // Arrange
      const eventId = 101;
      // El método delete no devuelve nada, así que lo mockeamos para que resuelva sin valor.
      EventRepository.prototype.delete.mockResolvedValue();

      // Act
      await eventService.deleteEvent(eventId);

      // Assert
      expect(EventRepository.prototype.delete).toHaveBeenCalledTimes(1);
      expect(EventRepository.prototype.delete).toHaveBeenCalledWith(eventId);
    });
  });

  // --- Pruebas para el método getEventsByTimelineId ---
  describe('getEventsByTimelineId', () => {
    it('debería llamar a eventRepo.findByTimelineId y devolver la lista de eventos', async () => {
      // Arrange
      const timelineId = 1;
      const mockEvents = [
        { event_id: 101, name: 'Evento 1', timeline_id: timelineId },
        { event_id: 102, name: 'Evento 2', timeline_id: timelineId },
      ];
      EventRepository.prototype.findByTimelineId.mockResolvedValue(mockEvents);

      // Act
      const result = await eventService.getEventsByTimelineId(timelineId);

      // Assert
      expect(EventRepository.prototype.findByTimelineId).toHaveBeenCalledTimes(1);
      expect(EventRepository.prototype.findByTimelineId).toHaveBeenCalledWith(timelineId);
      expect(result).toEqual(mockEvents);
    });
  });
});
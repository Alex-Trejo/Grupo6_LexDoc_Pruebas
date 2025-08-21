// tests/ObservationService.test.js

import { ObservationService } from '../src/services/ObservationService.js';
import { ObservationRepository } from '../src/repositories/ObservationRepository.js';
import { ProcessRepository } from '../src/repositories/ProcessRepository.js';

// Mockeamos ambos repositorios de los que depende el servicio.
jest.mock('../src/repositories/ObservationRepository.js');
jest.mock('../src/repositories/ProcessRepository.js');

describe('ObservationService', () => {
  let observationService;

  beforeEach(() => {
    observationService = new ObservationService();
    jest.clearAllMocks();
  });

  // --- Pruebas para el método createObservation ---
  describe('createObservation', () => {
    const observationData = { process_id: 1, title: 'Título', content: 'Contenido' };
    const accountId = 10;

    it('debería crear una observación si el proceso existe y pertenece al usuario', async () => {
      // Arrange
      const mockProcess = { process_id: 1, account_id: accountId };
      const mockCreatedObservation = { id: 101, ...observationData };
      
      ProcessRepository.prototype.findById.mockResolvedValue(mockProcess);
      ObservationRepository.prototype.create.mockResolvedValue(mockCreatedObservation);

      // Act
      const result = await observationService.createObservation(observationData, accountId);

      // Assert
      expect(ProcessRepository.prototype.findById).toHaveBeenCalledWith(1);
      expect(ObservationRepository.prototype.create).toHaveBeenCalledWith(observationData);
      expect(result).toEqual(mockCreatedObservation);
    });

    it('debería lanzar error "Proceso no encontrado" si el proceso no existe', async () => {
      ProcessRepository.prototype.findById.mockResolvedValue(null);
      await expect(observationService.createObservation(observationData, accountId))
        .rejects.toThrow('Proceso no encontrado');
    });

    it('debería lanzar error "No autorizado" si el proceso no pertenece al usuario', async () => {
      const mockProcess = { process_id: 1, account_id: 99 }; // ID de cuenta diferente
      ProcessRepository.prototype.findById.mockResolvedValue(mockProcess);
      await expect(observationService.createObservation(observationData, accountId))
        .rejects.toThrow('No autorizado');
    });
  });

  // --- Pruebas para el método modifyObservation ---
  describe('modifyObservation', () => {
    const accountId = 10;
    const observationId = 101;
    const originalObservation = { observation_id: observationId, title: 'Original', content: 'Original', process_owner: accountId };

    it('debería modificar una observación si pertenece al usuario', async () => {
      const updateData = { observation_id: observationId, title: 'Actualizado', content: 'Actualizado', account_id: accountId };
      ObservationRepository.prototype.findWithProcess.mockResolvedValue(originalObservation);
      ObservationRepository.prototype.update.mockResolvedValue({ id: observationId, ...updateData });

      await observationService.modifyObservation(updateData);

      expect(ObservationRepository.prototype.update).toHaveBeenCalledWith({
        observation_id: observationId,
        title: 'Actualizado',
        content: 'Actualizado',
      });
    });

    it('debería mantener los valores anteriores si los nuevos son strings vacíos', async () => {
        const updateData = { observation_id: observationId, title: '', content: '', account_id: accountId };
        ObservationRepository.prototype.findWithProcess.mockResolvedValue(originalObservation);
  
        await observationService.modifyObservation(updateData);
  
        expect(ObservationRepository.prototype.update).toHaveBeenCalledWith({
          observation_id: observationId,
          title: 'Original', // Se mantiene el valor original
          content: 'Original', // Se mantiene el valor original
        });
    });

    it('debería mantener los valores anteriores si no se proporcionan en el objeto', async () => {
        const updateData = { observation_id: observationId, account_id: accountId }; // Sin title ni content
        ObservationRepository.prototype.findWithProcess.mockResolvedValue(originalObservation);
  
        await observationService.modifyObservation(updateData);
  
        expect(ObservationRepository.prototype.update).toHaveBeenCalledWith({
          observation_id: observationId,
          title: 'Original',
          content: 'Original',
        });
    });

    it('debería lanzar error "Observación no encontrada"', async () => {
      ObservationRepository.prototype.findWithProcess.mockResolvedValue(null);
      await expect(observationService.modifyObservation({ observation_id: 999, account_id: accountId }))
        .rejects.toThrow('Observación no encontrada');
    });

    it('debería lanzar error "No autorizado para modificar"', async () => {
      const observationOfOtherUser = { ...originalObservation, process_owner: 99 };
      ObservationRepository.prototype.findWithProcess.mockResolvedValue(observationOfOtherUser);
      await expect(observationService.modifyObservation({ observation_id: observationId, account_id: accountId }))
        .rejects.toThrow('No autorizado para modificar esta observación');
    });
  });

  // --- Pruebas para el método deleteObservation ---
  describe('deleteObservation', () => {
    const accountId = 10;
    const observationId = 101;

    it('debería eliminar una observación si pertenece al usuario', async () => {
      const mockObservation = { observation_id: observationId, process_owner: accountId };
      ObservationRepository.prototype.findWithProcess.mockResolvedValue(mockObservation);
      ObservationRepository.prototype.delete.mockResolvedValue(); // No devuelve nada

      await observationService.deleteObservation({ observation_id: observationId, account_id: accountId });

      expect(ObservationRepository.prototype.delete).toHaveBeenCalledWith(observationId);
    });

    it('debería lanzar error "Observación no encontrada" al intentar eliminar', async () => {
      ObservationRepository.prototype.findWithProcess.mockResolvedValue(null);
      await expect(observationService.deleteObservation({ observation_id: 999, account_id: accountId }))
        .rejects.toThrow('Observación no encontrada');
    });

    it('debería lanzar error "No autorizado para eliminar"', async () => {
      const observationOfOtherUser = { observation_id: observationId, process_owner: 99 };
      ObservationRepository.prototype.findWithProcess.mockResolvedValue(observationOfOtherUser);
      await expect(observationService.deleteObservation({ observation_id: observationId, account_id: accountId }))
        .rejects.toThrow('No autorizado para eliminar esta observación');
    });
  });

  // --- Pruebas para el método getObservationsByProcessId ---
  describe('getObservationsByProcessId', () => {
    it('debería llamar al repositorio y devolver una lista de observaciones', async () => {
      const processId = 1;
      const mockObservations = [{ id: 1 }, { id: 2 }];
      ObservationRepository.prototype.findByProcessId.mockResolvedValue(mockObservations);

      const result = await observationService.getObservationsByProcessId(processId);

      expect(result).toEqual(mockObservations);
      expect(ObservationRepository.prototype.findByProcessId).toHaveBeenCalledWith(processId);
    });
  });
});
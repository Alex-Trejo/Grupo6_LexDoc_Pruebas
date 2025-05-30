import { ObservationRepository } from '../repositories/ObservationRepository.js';

const observationRepo = new ObservationRepository();

export class ObservationService {
  async addObservation(observationData) {
    return await observationRepo.create(observationData);
  }

  async modifyObservation(observationData) {
    return await observationRepo.update(observationData);
  }

  async deleteObservation(observation_id) {
    return await observationRepo.delete(observation_id);
  }

  async getObservationsByProcessId(process_id) {
    return await observationRepo.findByProcessId(process_id);
  }
}

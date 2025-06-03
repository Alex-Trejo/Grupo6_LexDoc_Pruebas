import { ObservationRepository } from '../repositories/ObservationRepository.js';
import { ProcessRepository } from '../repositories/ProcessRepository.js';

const observationRepo = new ObservationRepository();
const processRepo = new ProcessRepository();

export class ObservationService {
  async createObservation({ process_id, title, content }, account_id) {
  const process = await processRepo.findById(process_id);
  if (!process) {
    throw new Error('Proceso no encontrado');
  }

  if (process.account_id !== account_id) {
    throw new Error('No autorizado');
  }

  return await observationRepo.create({ process_id, title, content });
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

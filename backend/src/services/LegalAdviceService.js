import { LegalAdviceRepository } from '../repositories/LegalAdviceRepository.js';

const adviceRepo = new LegalAdviceRepository();

export class LegalAdviceService {
  async addLegalAdvice(adviceData) {
    return await adviceRepo.create(adviceData);
  }

  async modifyLegalAdvice(adviceData) {
    return await adviceRepo.update(adviceData);
  }

  async deleteLegalAdvice(advice_id) {
    return await adviceRepo.delete(advice_id);
  }

  async getLegalAdvicesByProcessId(process_id) {
    return await adviceRepo.findByProcessId(process_id);
  }
}

import { EvidenceRepository } from '../repositories/EvidenceRepository.js';

const evidenceRepo = new EvidenceRepository();

export class EvidenceService {
  async addEvidence(evidenceData) {
    return await evidenceRepo.create(evidenceData);
  }

  async modifyEvidence(evidenceData) {
    return await evidenceRepo.update(evidenceData);
  }

  async deleteEvidence(evidence_id) {
    return await evidenceRepo.delete(evidence_id);
  }

  async getEvidenceByProcessId(process_id) {
    return await evidenceRepo.findByProcessId(process_id);
  }
}

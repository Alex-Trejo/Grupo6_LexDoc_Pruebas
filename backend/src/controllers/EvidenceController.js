import { EvidenceService } from '../services/EvidenceService.js';

const evidenceService = new EvidenceService();

export class EvidenceController {
  async addEvidence(req, res) {
    try {
      const evidenceData = req.body;
      const evidence = await evidenceService.addEvidence(evidenceData);
      res.status(201).json(evidence);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async modifyEvidence(req, res) {
    try {
      const evidenceData = req.body;
      const updatedEvidence = await evidenceService.modifyEvidence(evidenceData);
      res.status(200).json(updatedEvidence);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteEvidence(req, res) {
    try {
      const { evidence_id } = req.params;
      await evidenceService.deleteEvidence(evidence_id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getEvidenceByProcess(req, res) {
    try {
      const { process_id } = req.params;
      const evidences = await evidenceService.getEvidenceByProcessId(process_id);
      res.status(200).json(evidences);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

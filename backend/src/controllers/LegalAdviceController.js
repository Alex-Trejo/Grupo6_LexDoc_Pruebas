import { LegalAdviceService } from '../services/LegalAdviceService.js';

const legalAdviceService = new LegalAdviceService();

export class LegalAdviceController {
  async addLegalAdvice(req, res) {
    try {
      const adviceData = req.body;
      const advice = await legalAdviceService.addLegalAdvice(adviceData);
      res.status(201).json(advice);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async modifyLegalAdvice(req, res) {
    try {
      const adviceData = req.body;
      const updatedAdvice = await legalAdviceService.modifyLegalAdvice(adviceData);
      res.status(200).json(updatedAdvice);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteLegalAdvice(req, res) {
    try {
      const { advice_id } = req.params;
      await legalAdviceService.deleteLegalAdvice(advice_id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getLegalAdvicesByProcess(req, res) {
    try {
      const { process_id } = req.params;
      const advices = await legalAdviceService.getLegalAdvicesByProcessId(process_id);
      res.status(200).json(advices);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

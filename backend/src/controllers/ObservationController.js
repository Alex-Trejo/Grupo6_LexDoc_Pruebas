import { ObservationService } from '../services/ObservationService.js';

const observationService = new ObservationService();

export class ObservationController {
  async addObservation(req, res) {
    try {
      const observationData = req.body;
      const observation = await observationService.addObservation(observationData);
      res.status(201).json(observation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async modifyObservation(req, res) {
    try {
      const observationData = req.body;
      const updatedObservation = await observationService.modifyObservation(observationData);
      res.status(200).json(updatedObservation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteObservation(req, res) {
    try {
      const { observation_id } = req.params;
      await observationService.deleteObservation(observation_id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getObservationsByProcess(req, res) {
    try {
      const { process_id } = req.params;
      const observations = await observationService.getObservationsByProcessId(process_id);
      res.status(200).json(observations);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

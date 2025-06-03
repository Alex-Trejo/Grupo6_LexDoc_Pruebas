import { ObservationService } from '../services/ObservationService.js';
import { ProcessService } from '../services/ProcessService.js';
const observationService = new ObservationService();
const processService = new ProcessService();
export class ObservationController {
  async addObservation(req, res) {
  try {
    const { process_id, title, content } = req.body;
    const account_id = req.user.id;

    const observation = await observationService.createObservation({ process_id, title, content }, account_id);
    res.status(201).json(observation);
  } catch (error) {
    if (error.message === 'Proceso no encontrado' || error.message === 'No autorizado') {
      return res.status(403).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
}


  async modifyObservation(req, res) {
  try {
    const { observation_id, observation_text, title, content } = req.body;
    const account_id = req.user.id;

    if (!observation_id) {
      return res.status(400).json({ message: 'Falta observation_id' });
    }

    // Pasamos los datos para validar y actualizar
    const updatedObservation = await observationService.modifyObservation({
      observation_id,
      observation_text,
      title,
      content,
      account_id
    });

    res.status(200).json(updatedObservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}



  async deleteObservation(req, res) {
  try {
    const { observation_id } = req.params;
    const account_id = req.user.id;

    await observationService.deleteObservation({ observation_id, account_id });

    res.status(200).json({ message: 'Observación eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


  async getObservationsByProcess(req, res) {
  try {
    const { process_id } = req.params;
    
    // Validar que el proceso exista
    const processExists = await processService.existsById(process_id);
    if (!processExists) {
      return res.status(404).json({ message: 'Proceso no encontrado' });
    }

    const observations = await observationService.getObservationsByProcessId(process_id);

    if (observations.length === 0) {
      return res.status(404).json({ message: 'No se encontraron observaciones para el proceso' });
    }

    res.status(200).json(observations);
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

}

import { ObservationService } from '../services/ObservationService.js';
import { ProcessService } from '../services/ProcessService.js';
<<<<<<< HEAD
const observationService = new ObservationService();
const processService = new ProcessService();
=======

const observationService = new ObservationService();
const processService = new ProcessService();

>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
export class ObservationController {
  async addObservation(req, res) {
    try {
      const { process_id, title, content } = req.body;
      const account_id = req.user.id;

<<<<<<< HEAD
=======
      if (!process_id || !title || !content) {
        return res.status(400).json({ message: 'Faltan campos requeridos' });
      }

      const processExists = await processService.existsById(process_id);
      if (!processExists) {
        return res.status(404).json({ message: 'Proceso no encontrado' });
      }

>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
      const observation = await observationService.createObservation(
        { process_id, title, content },
        account_id
      );
<<<<<<< HEAD
      res.status(201).json(observation);
    } catch (error) {
      if (
        error.message === "Proceso no encontrado" ||
        error.message === "No autorizado"
      ) {
        return res.status(403).json({ message: error.message });
      }
      res.status(400).json({ message: error.message });
=======

      return res.status(201).json(observation);
    } catch (error) {
      if (['Proceso no encontrado', 'No autorizado'].includes(error.message)) {
        return res.status(403).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error al crear la observación' });
>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
    }
  }

  async modifyObservation(req, res) {
    try {
<<<<<<< HEAD
      const { observation_id, observation_text, title, content } = req.body;
      const account_id = req.user.id;

      if (!observation_id) {
        return res.status(400).json({ message: "Falta observation_id" });
      }

      // Pasamos los datos para validar y actualizar
      const updatedObservation = await observationService.modifyObservation({
        observation_id,
        observation_text,
=======
      const { observation_id, title, content } = req.body;
      const account_id = req.user.id;

      if (!observation_id || !title || !content) {
        return res.status(400).json({ message: 'Faltan campos requeridos' });
      }

      const updatedObservation = await observationService.modifyObservation({
        observation_id,
>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
        title,
        content,
        account_id,
      });

<<<<<<< HEAD
      res.status(200).json(updatedObservation);
    } catch (error) {
      res.status(400).json({ message: error.message });
=======
      return res.status(200).json(updatedObservation);
    } catch (error) {
      if (error.message === 'Observación no encontrada') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === 'No autorizado') {
        return res.status(403).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: 'Error al modificar la observación' });
>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
    }
  }

  async deleteObservation(req, res) {
    try {
      const { observation_id } = req.params;
      const account_id = req.user.id;

<<<<<<< HEAD
=======
      if (!observation_id) {
        return res.status(400).json({ message: 'Falta observation_id' });
      }

>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
      await observationService.deleteObservation({
        observation_id,
        account_id,
      });

<<<<<<< HEAD
      res.status(204).send(); // <-- aquí el cambio principal
    } catch (error) {
      if (error.message === "Observación no encontrada") {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === "No autorizado") {
        return res.status(403).json({ message: error.message });
      }
      res.status(400).json({ message: error.message });
=======
      return res.status(204).send(); // sin contenido
    } catch (error) {
      if (error.message === 'Observación no encontrada') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === 'No autorizado') {
        return res.status(403).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: 'Error al eliminar la observación' });
>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
    }
  }

  async getObservationsByProcess(req, res) {
    try {
      const { process_id } = req.params;

<<<<<<< HEAD
      // Validar que el proceso exista
      const processExists = await processService.existsById(process_id);
      if (!processExists) {
        return res.status(404).json({ message: "Proceso no encontrado" });
=======
      if (!process_id) {
        return res.status(400).json({ message: 'Falta process_id' });
      }

      const processExists = await processService.existsById(process_id);
      if (!processExists) {
        return res.status(404).json({ message: 'Proceso no encontrado' });
>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
      }

      const observations = await observationService.getObservationsByProcessId(
        process_id
      );

<<<<<<< HEAD
      if (observations.length === 0) {
        return res
          .status(404)
          .json({ message: "No se encontraron observaciones para el proceso" });
      }

    res.status(200).json(observations);
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }

}
}
=======
      return res.status(200).json(observations); // Lista vacía está bien para 200
    } catch {
      return res
        .status(500)
        .json({ message: 'Error al obtener las observaciones' });
    }
  }

}

>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857

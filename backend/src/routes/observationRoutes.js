import express from 'express';
import { ObservationController } from '../controllers/ObservationController.js';

const router = express.Router();
const observationController = new ObservationController();

/**
 * @swagger
 * tags:
 *   name: Observations
 *   description: API para gestión de observaciones
 */

// CRUD observaciones


/**
 * @swagger
 * /observations:
 *   post:
 *     summary: Crear una nueva observación
 *     tags: [Observations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               process_id:
 *                 type: integer
 *               observation_text:
 *                 type: string
 *             required:
 *               - process_id
 *               - observation_text
 *     responses:
 *       201:
 *         description: Observación creada correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', observationController.addObservation.bind(observationController));



/**
 * @swagger
 * /observations/process/{process_id}:
 *   get:
 *     summary: Obtener observaciones por ID de proceso
 *     tags: [Observations]
 *     parameters:
 *       - in: path
 *         name: process_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del proceso legal
 *     responses:
 *       200:
 *         description: Lista de observaciones para el proceso
 *       404:
 *         description: No se encontraron observaciones para el proceso
 */
router.get('/process/:process_id', observationController.getObservationsByProcess.bind(observationController));

/**
 * @swagger
 * /observations:
 *   put:
 *     summary: Modificar una observación existente
 *     tags: [Observations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               observation_id:
 *                 type: integer
 *               observation_text:
 *                 type: string
 *             required:
 *               - observation_id
 *               - observation_text
 *     responses:
 *       200:
 *         description: Observación modificada correctamente
 *       400:
 *         description: Datos inválidos
 */
router.put('/', observationController.modifyObservation.bind(observationController));


/**
 * @swagger
 * /observations/{observation_id}:
 *   delete:
 *     summary: Eliminar una observación por ID
 *     tags: [Observations]
 *     parameters:
 *       - in: path
 *         name: observation_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la observación a eliminar
 *     responses:
 *       200:
 *         description: Observación eliminada correctamente
 *       404:
 *         description: No se encontró la observación
 */
router.delete('/:observation_id', observationController.deleteObservation.bind(observationController));

export default router;

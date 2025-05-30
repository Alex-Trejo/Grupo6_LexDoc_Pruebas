import express from 'express';
import { EvidenceController } from '../controllers/EvidenceController.js';

const router = express.Router();
const evidenceController = new EvidenceController();




/**
 * @swagger
 * tags:
 *   name: Evidences
 *   description: Endpoints para la gestión de evidencias relacionadas a procesos
 */


// CRUD evidencias


/**
 * @swagger
 * /api/evidences:
 *   post:
 *     summary: Agregar una evidencia
 *     tags: [Evidences]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               process_id:
 *                 type: integer
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               file_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Evidencia creada exitosamente
 *       400:
 *         description: Error en los datos de entrada
 */
router.post('/', evidenceController.addEvidence.bind(evidenceController));


/**
 * @swagger
 * /api/evidences/process/{process_id}:
 *   get:
 *     summary: Obtener evidencias por proceso
 *     tags: [Evidences]
 *     parameters:
 *       - in: path
 *         name: process_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proceso
 *     responses:
 *       200:
 *         description: Lista de evidencias
 *       404:
 *         description: No se encontraron evidencias
 */
router.get('/process/:process_id', evidenceController.getEvidenceByProcess.bind(evidenceController));


/**
 * @swagger
 * /api/evidences:
 *   put:
 *     summary: Modificar evidencia
 *     tags: [Evidences]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               evidence_id:
 *                 type: integer
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               file_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Evidencia actualizada
 *       404:
 *         description: Evidencia no encontrada
 */
router.put('/', evidenceController.modifyEvidence.bind(evidenceController));


/**
 * @swagger
 * /api/evidences/{evidence_id}:
 *   delete:
 *     summary: Eliminar evidencia
 *     tags: [Evidences]
 *     parameters:
 *       - in: path
 *         name: evidence_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la evidencia
 *     responses:
 *       200:
 *         description: Evidencia eliminada
 *       404:
 *         description: Evidencia no encontrada
 */
router.delete('/:evidence_id', evidenceController.deleteEvidence.bind(evidenceController));

export default router;

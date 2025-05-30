import express from 'express';
import { LegalAdviceController } from '../controllers/LegalAdviceController.js';

const router = express.Router();
const legalAdviceController = new LegalAdviceController();

// CRUD consejos legales


/**
 * @swagger
 * tags:
 *   name: LegalAdvices
 *   description: API para gestión de asesorías legales
 */




/**
 * @swagger
 * /legaladvices:
 *   post:
 *     summary: Crear una nueva asesoría legal
 *     tags: [LegalAdvices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               process_id:
 *                 type: integer
 *               advice_text:
 *                 type: string
 *             required:
 *               - process_id
 *               - advice_text
 *     responses:
 *       201:
 *         description: Asesoría legal creada correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', legalAdviceController.addLegalAdvice.bind(legalAdviceController));


/**
 * @swagger
 * /legaladvices/process/{process_id}:
 *   get:
 *     summary: Obtener asesorías legales por ID de proceso
 *     tags: [LegalAdvices]
 *     parameters:
 *       - in: path
 *         name: process_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del proceso legal
 *     responses:
 *       200:
 *         description: Lista de asesorías legales para el proceso
 *       404:
 *         description: No se encontraron asesorías para el proceso
 */
router.get('/process/:process_id', legalAdviceController.getLegalAdvicesByProcess.bind(legalAdviceController));


/**
 * @swagger
 * /legaladvices:
 *   put:
 *     summary: Modificar una asesoría legal existente
 *     tags: [LegalAdvices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               advice_id:
 *                 type: integer
 *               advice_text:
 *                 type: string
 *             required:
 *               - advice_id
 *               - advice_text
 *     responses:
 *       200:
 *         description: Asesoría legal modificada correctamente
 *       400:
 *         description: Datos inválidos
 */
router.put('/', legalAdviceController.modifyLegalAdvice.bind(legalAdviceController));


/**
 * @swagger
 * /legaladvices/{advice_id}:
 *   delete:
 *     summary: Eliminar una asesoría legal por ID
 *     tags: [LegalAdvices]
 *     parameters:
 *       - in: path
 *         name: advice_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la asesoría legal a eliminar
 *     responses:
 *       200:
 *         description: Asesoría legal eliminada correctamente
 *       404:
 *         description: No se encontró la asesoría legal
 */
router.delete('/:advice_id', legalAdviceController.deleteLegalAdvice.bind(legalAdviceController));

export default router;

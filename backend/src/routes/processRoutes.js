import express from 'express';
import { ProcessController } from '../controllers/ProcessController.js';

const router = express.Router();
const processController = new ProcessController();

/**
 * @swagger
 * tags:
 *   name: Processes
 *   description: API para gestión de procesos legales
 */


// CRUD procesos
/**
 * @swagger
 * /processes:
 *   post:
 *     summary: Crear un nuevo proceso
 *     tags: [Processes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               case_number:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *             required:
 *               - case_number
 *               - title
 *               - status
 *               - start_date
 *     responses:
 *       201:
 *         description: Proceso creado correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', processController.createProcess.bind(processController));


/**
 * @swagger
 * /processes/{process_id}:
 *   get:
 *     summary: Obtener un proceso por ID
 *     tags: [Processes]
 *     parameters:
 *       - in: path
 *         name: process_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del proceso
 *     responses:
 *       200:
 *         description: Proceso encontrado
 *       404:
 *         description: Proceso no encontrado
 */
router.get('/:process_id', processController.getProcessById.bind(processController));


/**
 * @swagger
 * /processes/{process_id}:
 *   put:
 *     summary: Actualizar un proceso por ID
 *     tags: [Processes]
 *     parameters:
 *       - in: path
 *         name: process_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del proceso a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               case_number:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Proceso actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Proceso no encontrado
 */
router.put('/:process_id', processController.updateProcess.bind(processController));

/**
 * @swagger
 * /processes/{process_id}:
 *   delete:
 *     summary: Eliminar un proceso por ID
 *     tags: [Processes]
 *     parameters:
 *       - in: path
 *         name: process_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del proceso a eliminar
 *     responses:
 *       200:
 *         description: Proceso eliminado correctamente
 *       404:
 *         description: Proceso no encontrado
 */
router.delete('/:process_id', processController.deleteProcess.bind(processController));

// Obtener todos o filtro por estado, fecha, nombre
/**
 * @swagger
 * /processes:
 *   get:
 *     summary: Obtener todos los procesos o filtrar por estado, fecha o nombre
 *     tags: [Processes]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         required: false
 *         description: Filtrar por estado del proceso
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Filtrar por fecha de inicio
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         required: false
 *         description: Filtrar por nombre/título del proceso
 *     responses:
 *       200:
 *         description: Lista de procesos
 */
router.get('/', processController.getAllProcesses.bind(processController));

export default router;

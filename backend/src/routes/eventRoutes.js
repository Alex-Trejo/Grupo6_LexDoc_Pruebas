import express from 'express';
import { EventController } from '../controllers/EventController.js';

const router = express.Router();
const eventController = new EventController();


/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Endpoints para la gestión de eventos en una línea de tiempo
 */

// CRUD eventos
//Endpoint para crear un evento no se usa debido a que se crea al crear una línea de tiempo(linetime)
// /**
//  * @swagger
//  * /events:
//  *   post:
//  *     summary: Crear un evento
//  *     tags: [Events]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               timeline_id:
//  *                 type: integer
//  *               title:
//  *                 type: string
//  *               description:
//  *                 type: string
//  *               date:
//  *                 type: string
//  *                 format: date
//  *     responses:
//  *       201:
//  *         description: Evento creado exitosamente
//  *       400:
//  *         description: Error en los datos de entrada
//  */
// router.post('/', eventController.createEvent.bind(eventController));



/**
 * @swagger
 * /api/events/timeline/{timeline_id}:
 *   get:
 *     summary: Obtener eventos por línea de tiempo
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: timeline_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la línea de tiempo
 *     responses:
 *       200:
 *         description: Lista de eventos
 *       404:
 *         description: No se encontraron eventos
 */
router.get('/timeline/:timeline_id', eventController.getEventsByTimeline.bind(eventController));

/**
 * @swagger
 * /api/events:
 *   put:
 *     summary: Actualizar un evento
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event_id:
 *                 type: integer
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Evento actualizado
 *       404:
 *         description: Evento no encontrado
 */
router.put('/', eventController.updateEvent.bind(eventController));

/**
 * @swagger
 * /api/events/{event_id}:
 *   delete:
 *     summary: Eliminar un evento
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: event_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento
 *     responses:
 *       200:
 *         description: Evento eliminado
 *       404:
 *         description: Evento no encontrado
 */
router.delete('/:event_id', eventController.deleteEvent.bind(eventController));

export default router;

import express from 'express';
import accountRoutes from './accountRoutes.js';
import processRoutes from './processRoutes.js';
import timelineRoutes from './timelineRoutes.js';
import eventRoutes from './eventRoutes.js';
import observationRoutes from './observationRoutes.js';
import evidenceRoutes from './evidenceRoutes.js';
import legalAdviceRoutes from './legalAdviceRoutes.js';

const router = express.Router();



/**
 * @swagger
 * tags:
 *   - name: Accounts
 *     description: Endpoints para gestión de cuentas de usuario
 *   - name: Processes
 *     description: Endpoints para la gestión de procesos legales
 *   - name: Timelines
 *     description: Endpoints para la gestión de líneas de tiempo
 *   - name: Events
 *     description: Endpoints para la gestión de eventos en líneas de tiempo
 *   - name: Observations
 *     description: Endpoints para la gestión de observaciones dentro de procesos
 *   - name: Evidences
 *     description: Endpoints para la gestión de evidencias legales
 *   - name: LegalAdvices
 *     description: Endpoints para la gestión de asesorías legales
 */

router.use('/accounts', accountRoutes);
router.use('/processes', processRoutes);
router.use('/timelines', timelineRoutes);
router.use('/events', eventRoutes);
router.use('/observations', observationRoutes);
router.use('/evidences', evidenceRoutes);
router.use('/legaladvices', legalAdviceRoutes);

export default router;

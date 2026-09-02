import { Router } from 'express';
import analyzeRoutes from './analyzeRoutes';
import caseRoutes from './caseRoutes';
import automationRoutes from './automationRoutes';

const router = Router();

router.use('/analyze', analyzeRoutes);
router.use('/cases', caseRoutes);
router.use('/automation-logs', automationRoutes);

export default router;

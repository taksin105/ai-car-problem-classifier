import { Router } from 'express';
import analyzeRoutes from './analyzeRoutes';
import caseRoutes from './caseRoutes';
import automationRoutes from './automationRoutes';
import settingsRoutes from './settingsRoutes';

const router = Router();

router.use('/analyze', analyzeRoutes);
router.use('/cases', caseRoutes);
router.use('/automation-logs', automationRoutes);
router.use('/settings', settingsRoutes);

export default router;

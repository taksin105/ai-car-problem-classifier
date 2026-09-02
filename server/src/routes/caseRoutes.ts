import { Router } from 'express';
import { listCasesHandler, statsHandler, getCaseHandler, updateStatusHandler } from '../controllers/caseController';
import { validateStatusUpdate } from '../middleware/validation';

const router = Router();

router.get('/stats', statsHandler);
router.get('/', listCasesHandler);
router.get('/:id', getCaseHandler);
router.patch('/:id/status', validateStatusUpdate, updateStatusHandler);

export default router;

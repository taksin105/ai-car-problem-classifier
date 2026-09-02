import { Router } from 'express';
import { listLogsHandler, getCaseLogsHandler } from '../controllers/automationController';

const router = Router();

router.get('/', listLogsHandler);
router.get('/:caseId', getCaseLogsHandler);

export default router;

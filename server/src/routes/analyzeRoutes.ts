import { Router } from 'express';
import { analyzeHandler } from '../controllers/analyzeController';
import { validateAnalyzeRequest } from '../middleware/validation';

const router = Router();

router.post('/', validateAnalyzeRequest, analyzeHandler);

export default router;

import { Router } from 'express';
import { getSettings, updateSettings, testWebhook } from '../controllers/settingsController';

const router = Router();

router.get('/', getSettings);
router.put('/', updateSettings);
router.post('/test', testWebhook);

export default router;

import { Router } from 'express';
import { searchHondaKnowledge, getHondaKnowledgeStats } from '../services/knowledgeService';

const router = Router();

// GET /api/knowledge - Search Honda Knowledge items
router.get('/', (req, res) => {
  try {
    const { search, model, category, urgency, limit } = req.query;
    const items = searchHondaKnowledge({
      search: search as string,
      model: model as string,
      category: category as string,
      urgency: urgency as string,
      limit: limit ? parseInt(limit as string, 10) : 100,
    });
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to search knowledge base' });
  }
});

// GET /api/knowledge/stats - Get Honda Knowledge statistics & reference guides
router.get('/stats', (req, res) => {
  try {
    const stats = getHondaKnowledgeStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch knowledge stats' });
  }
});

export default router;

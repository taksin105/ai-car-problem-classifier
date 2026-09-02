import { Request, Response, NextFunction } from 'express';
import { getCases, getCaseById, updateCaseStatus, getDashboardStats } from '../services/firestoreService';
import { CaseListQuery } from '../types';

/** GET /api/cases — List all cases */
export async function listCasesHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query: CaseListQuery = {
      search: req.query.search as string | undefined,
      category: req.query.category as any,
      urgency: req.query.urgency as any,
      status: req.query.status as any,
    };

    const cases = await getCases(query);
    res.json({ success: true, data: cases });
  } catch (error) {
    next(error);
  }
}

/** GET /api/cases/stats — Dashboard statistics */
export async function statsHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const stats = await getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
}

/** GET /api/cases/:id — Get single case */
export async function getCaseHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const serviceCase = await getCaseById(req.params.id as string);
    if (!serviceCase) {
      res.status(404).json({ success: false, error: 'Case not found' });
      return;
    }
    res.json({ success: true, data: serviceCase });
  } catch (error) {
    next(error);
  }
}

/** PATCH /api/cases/:id/status — Update case status */
export async function updateStatusHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const updated = await updateCaseStatus(req.params.id as string, req.body.status);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Case not found' });
      return;
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}

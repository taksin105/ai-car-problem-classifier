import { Request, Response, NextFunction } from 'express';
import { getAutomationLogs } from '../services/firestoreService';

/** GET /api/automation-logs — Get all automation logs */
export async function listLogsHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const logs = await getAutomationLogs();
    res.json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
}

/** GET /api/automation-logs/:caseId — Get logs for specific case */
export async function getCaseLogsHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const logs = await getAutomationLogs(req.params.caseId as string);
    res.json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
}

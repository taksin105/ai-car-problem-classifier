import { db } from '../config/firebase';
import { ServiceCase, CaseStatus, CaseListQuery, DashboardStats, AutomationLog } from '../types';
import { v4 as uuidv4 } from 'uuid';

const CASES_COLLECTION = 'serviceCases';
const LOGS_COLLECTION = 'automationLogs';

/** Create a new service case */
export async function createCase(caseData: Omit<ServiceCase, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<ServiceCase> {
  const id = uuidv4();
  const now = new Date().toISOString();
  
  const serviceCase: ServiceCase = {
    ...caseData,
    id,
    status: 'NEW',
    createdAt: now,
    updatedAt: now,
  };
  
  await db.collection(CASES_COLLECTION).doc(id).set(serviceCase);
  return serviceCase;
}

/** Get all cases with optional filters */
export async function getCases(query: CaseListQuery): Promise<ServiceCase[]> {
  const snapshot = await db.collection(CASES_COLLECTION).get();
  let cases = snapshot.docs.map(doc => doc.data() as ServiceCase);
  
  if (query.category) {
    cases = cases.filter(c => c.category === query.category);
  }
  if (query.urgency) {
    cases = cases.filter(c => c.urgency === query.urgency);
  }
  if (query.status) {
    cases = cases.filter(c => c.status === query.status);
  }
  if (query.search) {
    const searchLower = query.search.toLowerCase();
    cases = cases.filter(c =>
      c.customerName.toLowerCase().includes(searchLower) ||
      c.vehicleModel.toLowerCase().includes(searchLower) ||
      c.problemDescription.toLowerCase().includes(searchLower)
    );
  }
  
  // Sort desc by createdAt
  cases.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return cases;
}

/** Get a single case by ID */
export async function getCaseById(id: string): Promise<ServiceCase | null> {
  const doc = await db.collection(CASES_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return doc.data() as ServiceCase;
}

/** Update case status */
export async function updateCaseStatus(id: string, status: CaseStatus): Promise<ServiceCase | null> {
  const ref = db.collection(CASES_COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return null;
  
  await ref.update({
    status,
    updatedAt: new Date().toISOString(),
  });
  
  const updated = await ref.get();
  return updated.data() as ServiceCase;
}

/** Get dashboard statistics */
export async function getDashboardStats(): Promise<DashboardStats> {
  const snapshot = await db.collection(CASES_COLLECTION).get();
  const cases = snapshot.docs.map(doc => doc.data() as ServiceCase);
  
  return {
    total: cases.length,
    newCases: cases.filter(c => c.status === 'NEW').length,
    highPriority: cases.filter(c => c.urgency === 'HIGH').length,
    inProgress: cases.filter(c => c.status === 'IN_REVIEW' || c.status === 'ASSIGNED').length,
    completed: cases.filter(c => c.status === 'COMPLETED').length,
  };
}

/** Create automation log entry */
export async function createAutomationLog(
  caseId: string,
  event: string,
  status: 'SUCCESS' | 'FAILED',
  details?: string
): Promise<AutomationLog> {
  const id = uuidv4();
  const log: AutomationLog = {
    id,
    caseId,
    event,
    status,
    details: details || '',
    timestamp: new Date().toISOString(),
  };
  
  await db.collection(LOGS_COLLECTION).doc(id).set(log);
  return log;
}

/** Get automation logs, optionally filtered by caseId */
export async function getAutomationLogs(caseId?: string): Promise<AutomationLog[]> {
  let ref: FirebaseFirestore.Query = db.collection(LOGS_COLLECTION);
  
  if (caseId) {
    ref = ref.where('caseId', '==', caseId);
  }
  
  const snapshot = await ref.get();
  const logs = snapshot.docs.map(doc => doc.data() as AutomationLog);
  logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return logs;
}

export type ProblemCategory =
  | 'Engine'
  | 'Transmission'
  | 'Brake'
  | 'Suspension'
  | 'Electrical'
  | 'Air Conditioning'
  | 'Steering'
  | 'Tire'
  | 'Warning Light'
  | 'Body'
  | 'Other';

export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type CaseStatus = 'NEW' | 'IN_REVIEW' | 'ASSIGNED' | 'COMPLETED';

export interface CustomerInput {
  customerName: string;
  phoneNumber: string;
  vehicleModel: string;
  vehicleYear: number;
  mileage: number;
  problemDescription: string;
}

export interface AIAnalysis {
  category: ProblemCategory;
  urgency: UrgencyLevel;
  confidence: number;
  summary: string;
  symptoms: string[];
  possibleCauses: string[];
  followUpQuestions: string[];
  recommendation: string;
  requiresImmediateAttention: boolean;
  estimatedCost?: string;
  estimatedRepairTime?: string;
}

export interface ServiceCase extends CustomerInput, AIAnalysis {
  id: string;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
  estimatedCost?: string;
  estimatedRepairTime?: string;
}

export interface AutomationLog {
  id: string;
  caseId: string;
  event: string;
  status: 'SUCCESS' | 'FAILED';
  details?: string;
  timestamp: string;
}

export interface AnalyzeRequest extends CustomerInput {}

export interface AnalyzeResponse {
  success: boolean;
  data?: ServiceCase;
  error?: string;
}

export interface CaseListQuery {
  search?: string;
  category?: ProblemCategory;
  urgency?: UrgencyLevel;
  status?: CaseStatus;
}

export interface DashboardStats {
  total: number;
  newCases: number;
  highPriority: number;
  inProgress: number;
  completed: number;
}

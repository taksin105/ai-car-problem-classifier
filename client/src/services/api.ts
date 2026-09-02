import axios from 'axios';
import type { ServiceCase, CustomerInput, DashboardStats, AutomationLog, CaseStatus, ApiResponse } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

/** Analyze a vehicle problem */
export async function analyzeProblem(input: CustomerInput): Promise<ServiceCase> {
  const { data } = await api.post<ApiResponse<ServiceCase>>('/analyze', input);
  if (!data.success || !data.data) throw new Error(data.error || 'Analysis failed');
  return data.data;
}

/** Get all cases with optional filters */
export async function getCases(params?: {
  search?: string;
  category?: string;
  urgency?: string;
  status?: string;
}): Promise<ServiceCase[]> {
  const { data } = await api.get<ApiResponse<ServiceCase[]>>('/cases', { params });
  if (!data.success || !data.data) throw new Error(data.error || 'Failed to fetch cases');
  return data.data;
}

/** Get dashboard statistics */
export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await api.get<ApiResponse<DashboardStats>>('/cases/stats');
  if (!data.success || !data.data) throw new Error(data.error || 'Failed to fetch stats');
  return data.data;
}

/** Get a single case by ID */
export async function getCaseById(id: string): Promise<ServiceCase> {
  const { data } = await api.get<ApiResponse<ServiceCase>>(`/cases/${id}`);
  if (!data.success || !data.data) throw new Error(data.error || 'Case not found');
  return data.data;
}

/** Update case status */
export async function updateCaseStatus(id: string, status: CaseStatus): Promise<ServiceCase> {
  const { data } = await api.patch<ApiResponse<ServiceCase>>(`/cases/${id}/status`, { status });
  if (!data.success || !data.data) throw new Error(data.error || 'Failed to update status');
  return data.data;
}

/** Get automation logs */
export async function getAutomationLogs(caseId?: string): Promise<AutomationLog[]> {
  const url = caseId ? `/automation-logs/${caseId}` : '/automation-logs';
  const { data } = await api.get<ApiResponse<AutomationLog[]>>(url);
  if (!data.success || !data.data) throw new Error(data.error || 'Failed to fetch logs');
  return data.data;
}

/** Get system settings (Webhook) */
export async function getSettings(): Promise<{ webhookUrl: string; isConfigured: boolean; provider: string }> {
  const { data } = await api.get('/settings');
  if (!data.success || !data.data) throw new Error(data.error || 'Failed to fetch settings');
  return data.data;
}

/** Update system settings */
export async function updateSettings(webhookUrl: string): Promise<{ webhookUrl: string; isConfigured: boolean }> {
  const { data } = await api.put('/settings', { webhookUrl });
  if (!data.success || !data.data) throw new Error(data.error || 'Failed to update settings');
  return data.data;
}

/** Test sending webhook to Discord */
export async function testWebhook(webhookUrl?: string): Promise<{ success: boolean; message: string }> {
  const { data } = await api.post('/settings/test', { webhookUrl });
  if (!data.success) throw new Error(data.error || 'Failed to send test webhook');
  return data;
}

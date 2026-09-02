export type PipelineStage =
  | 'PROSPECT'
  | 'QUALIFICATION'
  | 'PROPOSAL'
  | 'NEGOTIATION'
  | 'CLOSED_WON'
  | 'CLOSED_LOST';

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export type ActivityType = 'CALL' | 'EMAIL' | 'MEETING' | 'FOLLOW_UP';

export interface Customer {
  id: string;
  code: string; // Mã KH (e.g. KH001)
  name: string;
  company: string;
  industry: string;
  phone: string;
  email: string;
  taxCode?: string;
  address?: string;
  status: 'LEAD' | 'CUSTOMER' | 'INACTIVE';
  assignedTo: string;
  createdDate: string;
}

export interface Activity {
  id: string;
  dealId: string;
  customerId: string;
  type: ActivityType;
  title: string;
  notes: string;
  date: string;
  nextActionDate?: string;
  nextActionTitle?: string;
  status: 'COMPLETED' | 'PENDING' | 'OVERDUE';
  createdBy: string;
}

export interface Deal {
  id: string;
  code: string; // Mã Deal (e.g. DL-2026-001)
  title: string;
  customerId: string;
  customerName: string;
  companyName: string;
  amount: number; // VNĐ
  stage: PipelineStage;
  probability: number; // 0 - 100%
  priority: Priority;
  expectedCloseDate: string;
  lastContactDate: string; // Ngày tương tác gần nhất
  nextActionDate?: string; // Ngày hẹn hành động tiếp theo
  nextActionTitle?: string;
  assignedSales: string;
  notes: string;
  tags: string[];
}

export interface CrmMetrics {
  totalPipelineValue: number;
  totalRevenueWon: number;
  totalDealsCount: number;
  winRatePercentage: number;
  forecastedRevenue: number;
  averageDealSize: number;
  staleDealsCount: number; // Deals > 14 ngày chưa tương tác
  overdueTasksCount: number; // Tasks quá hạn next action
}

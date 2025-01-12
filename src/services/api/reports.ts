import { handleResponse } from '@/utils/apiUtils';

interface ReportFilters {
  period?: 'weekly' | 'monthly' | 'yearly';
  startDate?: string;
  endDate?: string;
}

export interface ReportData {
  salesOverview: {
    totalSales: number;
    totalOrders: number;
    paidAmount: number;
    remainingAmount: number;
    averageOrderValue: number;
  };
  salesByStatus: Array<{
    _id: string;
    count: number;
    totalAmount: number;
  }>;
  salesByCustomerType: Array<{
    _id: string;
    totalAmount: number;
    orderCount: number;
  }>;
  topProducts: Array<{
    _id: string;
    totalQuantity: number;
    totalRevenue: number;
  }>;
  salesTrend: Array<{
    date: string;
    amount: number;
    orders: number;
  }>;
}

export const reportsApi = {
  getReports: async (filters?: ReportFilters) => {
    const params = new URLSearchParams();
    if (filters?.period) params.append('period', filters.period);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const response = await fetch(`/api/reports?${params.toString()}`);
    return handleResponse<ReportData>(response);
  },
}; 
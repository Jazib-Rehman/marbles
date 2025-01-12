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
  getReports: async () => {
    const response = await fetch('/api/reports');
    return handleResponse<ReportData>(response);
  },
}; 
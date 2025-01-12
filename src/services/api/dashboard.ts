import { handleResponse } from '@/utils/apiUtils';

interface DashboardStats {
  stats: {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
    unpaidAmount: number;
    totalB2BCustomers: number;
    totalB2CCustomers: number;
    lowStockItems: number;
  };
  recentOrders: any[];
  topCustomers: any[];
  salesByStatus: any[];
  revenueData: Array<{
    month: string;
    revenue: number;
  }>;
  ordersByStatus: Array<{
    _id: string;
    count: number;
  }>;
}

export const dashboardApi = {
  getStats: async () => {
    const response = await fetch('/api/dashboard');
    return handleResponse<DashboardStats>(response);
  }
}; 
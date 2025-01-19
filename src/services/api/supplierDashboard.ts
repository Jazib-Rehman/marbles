import { handleResponse } from '@/utils/apiUtils';

interface SupplierDashboardStats {
  stats: {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalExpense: number;
    unpaidAmount: number;
    totalSuppliers: number;
  };
  recentOrders: any[];
  topSuppliers: any[];
  expenseData: Array<{
    month: string;
    expense: number;
  }>;
}

export const supplierDashboardApi = {
  getStats: async () => {
    const response = await fetch('/api/supplier-dashboard');
    return handleResponse<SupplierDashboardStats>(response);
  }
}; 
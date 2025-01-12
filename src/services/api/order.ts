import { handleResponse } from '@/utils/apiUtils';
import { IOrder, IOrderItem, IPayment } from '@/models/Order';

interface OrderFilters {
  search?: string;
  status?: "Pending" | "Processing" | "Completed" | "Cancelled";
  customerType?: "B2B" | "B2C";
  paymentStatus?: "Unpaid" | "Partially Paid" | "Paid";
}

interface CreateOrderData {
  customer: string;
  items: Array<{
    inventory: string;
    quantity: number;
    ratePerFoot?: number;
  }>;
  deliveryAddress: string;
  deliveryDate?: Date;
  notes?: string;
}

interface UpdateOrderData {
  status?: "Pending" | "Processing" | "Completed" | "Cancelled";
  deliveryAddress?: string;
  deliveryDate?: Date;
  notes?: string;
  payments?: IPayment[];
}

export const orderApi = {
  // Get all orders with optional filters
  getAll: async (filters?: OrderFilters) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.customerType) params.append("customerType", filters.customerType);
    
    const response = await fetch(`/api/orders?${params.toString()}`);
    return handleResponse<IOrder[]>(response);
  },

  // Get single order by ID
  getById: async (id: string) => {
    const response = await fetch(`/api/orders?id=${id}`);
    return handleResponse<IOrder>(response);
  },

  // Create new order
  create: async (data: CreateOrderData) => {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<IOrder>(response);
  },

  // Update order
  update: async (id: string, data: UpdateOrderData) => {
    const response = await fetch(`/api/orders?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<IOrder>(response);
  },

  // Add payment to order
  addPayment: async (id: string, payment: IPayment) => {
    const response = await fetch(`/api/orders?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payments: [payment]
      }),
    });
    return handleResponse<IOrder>(response);
  },

  // Cancel order
  cancel: async (id: string, reason?: string) => {
    const response = await fetch(`/api/orders?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: "Cancelled",
        notes: reason
      }),
    });
    return handleResponse<IOrder>(response);
  },

  // Delete order (only pending orders)
  delete: async (id: string) => {
    const response = await fetch(`/api/orders?id=${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  // Helper function to calculate order totals
  calculateTotals: (items: IOrderItem[]) => {
    return items.reduce((sum, item) => sum + item.totalAmount, 0);
  },

  // Helper function to get payment status
  getPaymentStatus: (totalAmount: number, paidAmount: number) => {
    if (paidAmount === 0) return "Unpaid";
    if (paidAmount < totalAmount) return "Partially Paid";
    return "Paid";
  },

  // Helper function to format order number
  formatOrderNumber: (orderNumber: string) => {
    return orderNumber.toUpperCase();
  },

  // Helper function to get order status color
  getStatusColor: (status: IOrder['status']) => {
    const colors = {
      Pending: 'yellow',
      Processing: 'blue',
      Completed: 'green',
      Cancelled: 'red',
    };
    return colors[status] || 'gray';
  },

  // Helper function to get payment status color
  getPaymentStatusColor: (status: IOrder['paymentStatus']) => {
    const colors = {
      Unpaid: 'red',
      'Partially Paid': 'yellow',
      Paid: 'green',
    };
    return colors[status] || 'gray';
  },
}; 
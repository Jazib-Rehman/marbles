import { handleResponse } from '@/utils/apiUtils';
import { ISupplyOrder } from '@/models/SupplyOrder';

export const supplyOrderApi = {
  getAll: async (search?: string) => {
    const queryString = search ? `?search=${encodeURIComponent(search)}` : '';
    const response = await fetch(`/api/supply-orders${queryString}`);
    return handleResponse<ISupplyOrder[]>(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`/api/supply-orders/${id}`);
    return handleResponse<ISupplyOrder>(response);
  },

  create: async (data: Omit<ISupplyOrder, '_id' | 'orderNumber'>) => {
    const response = await fetch('/api/supply-orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<ISupplyOrder>(response);
  },

  update: async (id: string, data: Partial<ISupplyOrder>) => {
    const response = await fetch(`/api/supply-orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<ISupplyOrder>(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`/api/supply-orders/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  addFactoryPayment: async (id: string, paymentData: any) => {
    const response = await fetch(`/api/supply-orders?id=${id}&action=factory-payment`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    return handleResponse<ISupplyOrder>(response);
  },

  addCustomerPayment: async (id: string, paymentData: any) => {
    const response = await fetch(`/api/supply-orders?id=${id}&action=customer-payment`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    return handleResponse<ISupplyOrder>(response);
  },

  updateStatus: async (id: string, status: 'Pending' | 'Processing' | 'Dispatched' | 'Delivered' | 'Completed') => {
    const response = await fetch(`/api/supply-orders?id=${id}&action=status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return handleResponse<ISupplyOrder>(response);
  },
}; 
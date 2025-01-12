import { handleResponse } from '@/utils/apiUtils';
import { IB2BCustomer, IB2CCustomer } from '@/models/Customer';

type Customer = IB2BCustomer | IB2CCustomer;

export const customerApi = {
  getAll: async (search?: string, type?: "B2B" | "B2C") => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (type) params.append("type", type);
    
    const response = await fetch(`/api/customers?${params.toString()}`);
    return handleResponse<Customer[]>(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`/api/customers?id=${id}`);
    return handleResponse<Customer>(response);
  },

  create: async (data: Omit<Customer, '_id'>) => {
    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Customer>(response);
  },

  update: async (id: string, data: Partial<Customer>) => {
    const response = await fetch(`/api/customers?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Customer>(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`/api/customers?id=${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
}; 
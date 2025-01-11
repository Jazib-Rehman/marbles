import { handleResponse } from '@/utils/apiUtils';

export interface InventoryItem {
  _id?: string;
  marbleType: string;
  size: string;
  quantity: number;
  purchaseRate: number;
  saleRate: number;
  location?: string;
  notes?: string;
  status?: string;
}

export const inventoryApi = {
  getAll: async (search?: string) => {
    const queryString = search ? `?search=${encodeURIComponent(search)}` : '';
    const response = await fetch(`/api/inventory${queryString}`);
    return handleResponse<InventoryItem[]>(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`/api/inventory/${id}`);
    return handleResponse<InventoryItem>(response);
  },

  create: async (data: Omit<InventoryItem, '_id'>) => {
    const response = await fetch('/api/inventory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<InventoryItem>(response);
  },

  update: async (id: string, data: Partial<InventoryItem>) => {
    const response = await fetch(`/api/inventory/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<InventoryItem>(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`/api/inventory/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
}; 
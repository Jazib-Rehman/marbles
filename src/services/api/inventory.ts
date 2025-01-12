import { handleResponse } from '@/utils/apiUtils';
import { IInventory } from '@/models/Inventory';

export const inventoryApi = {
  getAll: async (search?: string) => {
    const queryString = search ? `?search=${encodeURIComponent(search)}` : '';
    const response = await fetch(`/api/inventory${queryString}`);
    return handleResponse<IInventory[]>(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`/api/inventory?id=${id}`);
    return handleResponse<IInventory>(response);
  },

  create: async (data: Omit<IInventory, '_id'>) => {
    const response = await fetch('/api/inventory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<IInventory>(response);
  },

  update: async (id: string, data: Partial<IInventory>) => {
    const response = await fetch(`/api/inventory?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<IInventory>(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`/api/inventory?id=${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
}; 
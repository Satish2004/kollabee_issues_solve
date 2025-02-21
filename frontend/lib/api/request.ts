import { api } from '../axios';
import { Request } from '@/types/api';

export interface CreateRequestData {
  productName: string;
  category: string;
  subCategory?: string;
  productType?: string;
  quantity: number;
  targetPrice?: number;
  orderFrequency?: string;
  country: string;
  leadSize?: number;
  sellerId: string;
}

export const requestApi = {
  getAll: async (params?: {
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    return api.get<Request[]>('/requests', { params });
  },

  create: async (data: CreateRequestData) => {
    return api.post<Request>('/requests', data);
  },

  getById: async (id: string) => {
    return api.get<Request>(`/requests/${id}`);
  },

  update: async (id: string, data: Partial<CreateRequestData>) => {
    return api.put<Request>(`/requests/${id}`, data);
  },

  delete: async (id: string) => {
    return api.delete(`/requests/${id}`);
  },

  updateStatus: async (id: string, status: 'APPROVED' | 'REJECTED') => {
    return api.patch<Request>(`/requests/${id}/status`, { status });
  }
}; 
import { api } from '../axios';
import { Category } from '@/types/api';

export const categoryApi = {
  getAll: async () => {
    return api.get<Category[]>('/categories');
  },

  getById: async (id: string) => {
    return api.get<Category>(`/categories/${id}`);
  },

  create: async (categoryName: string) => {
    return api.post<Category>('/categories', { categoryName });
  }
}; 
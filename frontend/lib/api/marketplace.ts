import { api } from '../axios';

export const marketplaceApi = {
  getProducts: async (params?: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) => {
    return api.get('/marketplace/products', { params });
  },

  getProductDetails: async (id: string) => {
    return api.get(`/marketplace/products/${id}`);
  },

  getRelatedProducts: async (productId: string) => {
    return api.get(`/marketplace/products/${productId}/related`);
  }
}; 
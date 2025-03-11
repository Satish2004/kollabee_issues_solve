import { CategoryEnum } from '@/types/api';
import { BusinessType } from '@/types/api';
import { api } from '../axios';
import { Product } from '@/types/api';
import { Request } from "@/types/api";

export interface BusinessInfo {
  businessName: string;
  businessAddress: string;
  websiteLink: string;
  businessTypes: string[];
  businessCategories: string[];
}

export interface GoalsAndMetrics {
  objectives: string[];
  challenges: string[];
  metrics: string[];
}

interface GetProductsParams {
  sortBy?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  isDraft?: boolean;
}

export const sellerApi = {
  getProducts: async (params?: GetProductsParams) => {
    return api.get<Product[]>('/seller/products', { params });
  },


 
  getOrders: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    return api.get('/seller/orders', { params });
  },

  getBusinessInfo: async () => {
    return api.get('/seller/business');
  },

  updateBusinessInfo: (data: BusinessInfo) => 
    api.put('/seller/business-info', data),

  // updateGoalsAndMetrics: (data: GoalsAndMetrics) =>
  //   api.post('/seller/goals-metrics', data),

  // getDashboard: async (period?: '7d' | '30d') => {
  //   return api.get('/seller/dashboard', { params: { period } });
  // },

  // updateProfile: async (data: {
  //   businessName: string;
  //   businessAddress: string;
  //   websiteLink: string;
  //   businessTypes: BusinessType[];
  //   businessCategories: CategoryEnum[];
  //   roleInCompany: string;
  //   objectives: string[];
  //   challenges: string[];
  //   metrics: string[];
  // }) => {
  //   const response = await api.patch('/seller/profile', data);
  //   return response.data;
  // },

  // getRandomRequests: async () => {
  //   return api.get<Request[]>('/seller/requests/random');
  // },

  // acceptRequest: async (requestId: string) => {
  //   return api.post(`/seller/requests/${requestId}/accept`);
  // }
};

sellerApi.getProducts(); 
import { api } from '../axios';

export const advertiseApi = {
  createAdvertisement: async (data: {
    productId: string;
    budget: number;
    startDate: Date;
    endDate: Date;
    targetAudience: string[];
    adType: string;
    description?: string;
  }) => {
    return api.post('/advertise', data);
  },

  getAdvertisements: async (params?: {
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    return api.get('/advertise', { params });
  },

  // updateAdvertisement: async (id: string, data: any) => {
  //   return api.put(`/advertise/${id}`, data);
  // },

  // getAdvertisementMetrics: async (id: string) => {
  //   return api.get(`/advertise/${id}/metrics`);
  // }
}; 
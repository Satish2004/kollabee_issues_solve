import { api } from '../axios';

export const addressApi = {
  getAddresses: async (type?: 'BILLING' | 'SHIPPING') => {
    return api.get('/addresses', { params: { type } });
  },

  createAddress: async (data: {
    firstName: string;
    lastName: string;
    companyName?: string;
    address: string;
    country: string;
    state: string;
    city: string;
    zipCode: string;
    email: string;
    phoneNumber: string;
    type: 'BILLING' | 'SHIPPING';
  }) => {
    return api.post('/addresses', data);
  },

  updateAddress: async (id: string, data: any) => {
    return api.put(`/addresses/${id}`, data);
  },

  deleteAddress: async (id: string) => {
    return api.delete(`/addresses/${id}`);
  }
}; 
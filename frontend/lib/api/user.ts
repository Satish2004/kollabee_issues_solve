import { api } from '../axios';

export const userApi = {
  getProfile: async () => {
    return api.get('/users/profile');
  },

  updateProfile: async (data: {
    name?: string;
    phoneNumber?: string;
    country?: string;
    state?: string;
    address?: string;
    companyName?: string;
    companyWebsite?: string;
  }) => {
    return api.put('/users/profile', data);
  }
}; 
import { api } from '../axios';
import { User } from '@/types/api';

export interface ProfileUpdateData {
  name?: string;
  fullName?: string;
  email?: string;
  companyName?: string;
  companyWebsite?: string;
  imageUrl?: string;
  phoneNumber?: string;
  country?: string;
  state?: string;
  address?: string;
  zipCode?: string;
}

export const profileApi = {
  getCurrentUser: async () => {
    return api.get<User>('/auth/me');
  },

  updateProfile: async (data: ProfileUpdateData) => {
    return api.patch<User>('/upload/profile-image', data);
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post<{ imageUrl: string }>('/upload/product-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}; 
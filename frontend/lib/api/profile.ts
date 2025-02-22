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

export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
}

export interface BankDetailsData {
  accountHolder: string;
  bankName: string;
  bankType: string;
  accountNumber: string;
  cvvCode: string;
  upiId?: string;
  zipCode: string;
}

export const profileApi = {
  getCurrentUser: async () => {
    return api.get<User>('/auth/me');
  },

  updateProfile: async (data: ProfileUpdateData) => {
    return api.patch<User>('/users/profile', data);
  },

  updatePassword: async (data: PasswordUpdateData) => {
      return api.post('/auth/update-password', data);
  },

  updateBankDetails: async (data: BankDetailsData) => {
      return api.post('/payment/bank-details', data);
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post<{ imageUrl: string }>('/upload/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getBankDetails: async () => {
    return api.get('/payment/bank-details');
  }
}; 
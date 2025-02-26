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
  },

  // Get seller profile details
  getSellerProfile: async () => {
    return api.get('/seller/profile');
  },

  // Update seller profile categories
  updateCategories: async (data: any) => {
    return api.put('/seller/profile/categories', data);
  },

  // Update production services
  updateProductionServices: async (data: any) => {
    return api.put('/seller/profile/production-services', data);
  },

  // Update production management
  updateProductionManagement: async (data: any) => {
    return api.put('/seller/profile/production-management', data);
  },

  // Update manufacturing locations
  updateManufacturingLocations: async (data: any) => {
    return api.put('/seller/profile/manufacturing-locations', data);
  },

  // Update business capabilities
  updateBusinessCapabilities: async (data: any) => {
    return api.put('/seller/profile/capabilities', data);
  },

  // Update target audience
  updateTargetAudience: async (data: any) => {
    return api.put('/seller/profile/target-audience', data);
  },

  // Update team size
  updateTeamSize: async (data: any) => {
    return api.put('/seller/profile/team-size', data);
  },

  // Update annual revenue
  updateAnnualRevenue: async (data: any) => {
    return api.put('/seller/profile/annual-revenue', data);
  },

  // Update minimum order quantity
  updateMinimumOrder: async (data: any) => {
    return api.put('/seller/profile/minimum-order', data);
  },

  // Update comments and notes
  updateComments: async (data: any) => {
    return api.put('/seller/profile/comments', data);
  },

  // Update certificates
  updateCertificates: async (data: any) => {
    return api.put('/seller/profile/certificates', data);
  }
}; 
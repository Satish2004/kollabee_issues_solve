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

  //Get Categories
  getCategories: async () => {
    return api.get('/seller/profile/categories');
  },

  // Update production services
  updateProductionServices: async (data: any) => {
    return api.put('/seller/profile/production-services', data);
  },

  //Get Production Services
  getProductionServices: async () => {
    return api.get('/seller/profile/production-services');
  },

  // Update production management
  updateProductionManagement: async (data: any) => {
    return api.put('/seller/profile/production-management', data);
  },

  //Get Production Management
  getProductionManagement: async () => {
    return api.get('/seller/profile/production-management');
  },

  // Update manufacturing locations
  updateManufacturingLocations: async (data: any) => {
    return api.put('/seller/profile/manufacturing-locations', data);
  },

  // Get manufacturing locations
  getManufacturingLocations: async () => {
    return api.get('/seller/profile/manufacturing-locations');
  },

  // Update business capabilities
  updateBusinessCapabilities: async (data: any) => {
    return api.put('/seller/profile/capabilities', data);
  },

  // Get business capabilities
  getBusinessCapabilities: async () => {
    return api.get('/seller/profile/capabilities');
  },

  // Update target audience
  updateTargetAudience: async (data: any) => {
    return api.put('/seller/profile/target-audience', data);
  },

  // Get target audience
  getTargetAudience: async () => {
    return api.get('/seller/profile/target-audience');
  },

  // Update team size
  updateTeamSize: async (data: any) => {
    return api.put('/seller/profile/team-size', data);
  },

  // Get team size
  getTeamSize: async () => {
    return api.get('/seller/profile/team-size');
  },

  // Update annual revenue
  updateAnnualRevenue: async (data: any) => {
    return api.put('/seller/profile/annual-revenue', data);
  },

  // Get annual revenue
  getAnnualRevenue: async () => {
    return api.get('/seller/profile/annual-revenue');
  },

  // Update minimum order quantity
  updateMinimumOrder: async (data: any) => {
    return api.put('/seller/profile/minimum-order', data);
  },

  // Get minimum order quantity
  getMinimumOrder: async () => {
    return api.get('/seller/profile/minimum-order');
  },

  // Update comments and notes
  updateCommentsNotes: async (data: any) => {
    return api.put('/seller/profile/comments', data);
  },

  // Get comments and notes
  getCommentsNotes: async () => {
    return api.get('/seller/profile/comments');
  },

  //Upload Certificate
  uploadCertificate: async (formData: FormData) => { // Accept full FormData
    return api.post('/seller/profile/certificates', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  

  // Update certificates
  // updateCertificates: async (file: File) => {
  //   const formData = new FormData();
  //   formData.append('image', file);
  //   return api.post<{ url: string }>('/seller/profile/certificates', formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   })
  // },

  // Get certificates
  getCertificates: async () => {
    return api.get('/seller/profile/certificates');
  },

  deleteCertificate: async (certificateId: string) => {
    return api.delete(`/seller/profile/certificates/${certificateId}`);
  },

  getProfileCompletion: async () => {
    return api.get('/seller/profile/completion');
  },
}; 

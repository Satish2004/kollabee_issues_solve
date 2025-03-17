import { CategoryEnum } from "../../types/api";
import { BusinessType } from "../../types/api";
import { api } from "../axios";
import { setToken, removeToken } from "../utils/token";

interface SignupData {
  // User details
  email: string;
  password: string;
  name: string;
  role: "BUYER" | "SELLER";
  phoneNumber?: string;

  // Company details
  companyName?: string;
  companyWebsite?: string;
  address?: string;

  // Seller specific details
  businessName?: string;
  businessAddress?: string;
  websiteLink?: string;
  businessTypes?: BusinessType[];
  businessCategories?: CategoryEnum[];
  roleInCompany?: string;
  objectives?: string[];
  challenges?: string[];
  metrics?: string[];
}
const authUrl = process.env.NEXT_PUBLIC_API_URL;

export const authApi = {
  login: async (data: { email: string; password: string }) => {
    const response: any = await api.post(`${authUrl}/auth/login`, data);
    // Set token after sconsuccessful login
    console.log(response);
    if (response.token) {
      setToken(response.token);
      localStorage.setItem("token", response.token);
    }
    return response;
  },

  signup: async (data: SignupData) => {
    const response: any = await api.post(`${authUrl}/auth/signup`, data);
    if (response?.token) {
      setToken(response?.token);
      localStorage.setItem("token", response?.token);
    }
    return response;
  },

  generateOTP: async (email: string) => {
    return api.post(`${authUrl}/auth/generate-otp`, { email });
  },

  verifyOTP: async (data: { email: string; otp: string }) => {
    return api.post(`${authUrl}/auth/verify-otp`, data);
  },

  getCurrentUser: async () => {
    return api.get(`${authUrl}/auth/me`);
  },

  forgotPassword: async (email: string) => {
    return api.post(`${authUrl}/auth/forgot-password`, { email });
  },

  resetPassword: async (data: { token: string; newPassword: string }) => {
    return api.post(`${authUrl}/auth/reset-password`, data);
  },

  logout: async () => {
    const response = await api.post(`${authUrl}/auth/logout`);

    return removeToken();
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await api.post(`${authUrl}/auth/change-password`, data);
    return response.data;
  },
};

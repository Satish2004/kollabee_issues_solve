import { CategoryEnum } from "../../types/api";
import { BusinessType } from "../../types/api";
import { api } from "../axios";
import { setToken, removeToken } from "../utils/token";
import Cookies from "js-cookie";

interface SignupData {
  // User details
  email: string;
  password: string;
  name: string;
  role: "BUYER" | "SELLER";
  phone?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  countryCode?: string;

  // Company details
  companyName?: string;
  companyWebsite?: string;
  address?: string;

  // Seller specific details
  businessName?: string;
  businessDescription?: string;
  businessAddress?: string;
  websiteLink?: string;
  businessTypes?: BusinessType[];
  businessCategories?: CategoryEnum[];
  roleInCompany?: string;
  selectedObjectives?: string[];
  selectedChallenges?: string[];
  selectedMetrics?: string[];
  agreement1?: boolean;
  agreement2?: boolean;
}
const authUrl = process.env.NEXT_PUBLIC_API_URL;

export const authApi = {
  login: async (data: { email: string; password: string; role: string }) => {
    const response: any = await api.post(`${authUrl}/auth/login`, data);
    // Set token after successful login
    // set cookies as well

    if (response.token) {
      setToken(response.token);
      Cookies.set("token", response.token, { expires: 7 }); // Token expires in 7 days
    }
    return response;
  },

  signup: async (data: SignupData) => {
    const response: any = await api.post(`${authUrl}/auth/signup`, data);
    if (response?.token) {
      setToken(response?.token);
      Cookies.set("token", response?.token, { expires: 7 }); // Token expires in 7 days
    }
    return response;
  },

  buyerGoogleLogin: async (data: {
    token: string;
    businessName: string;
    businessDescription: string;
    businessType: string; // Brand Owner, Retailer, Startup, Individual Entrepreneur, Other
    otherBusinessType?: string;
    lookingFor: string[]; // What the buyer is looking for
    role: string;
  }) => {
    const response: any = await api.post(`${authUrl}/auth/buyer/google`, data);
    if (response?.token) {
      setToken(response?.token);
      Cookies.set("token", response?.token, { expires: 7 }); // Token expires in 7 days
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
    try {
      return await api.get(`${authUrl}/auth/me`);
    } catch (error: any) {
      if (error.response?.status === 401) {
        removeToken();
        Cookies.remove("token");
      }
      throw error;
    }
  },

  forgotPassword: async (email: string) => {
    return api.post(`${authUrl}/auth/forgot-password`, { email });
  },

  resetPassword: async (data: { token: string; newPassword: string }) => {
    return api.post(`${authUrl}/auth/reset-password`, data);
  },

  logout: async () => {
    const response = await api.post(`${authUrl}/auth/logout`);
    removeToken();
    Cookies.remove("token");
    return response;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await api.post(`${authUrl}/auth/change-password`, data);
    return response.data;
  },
};

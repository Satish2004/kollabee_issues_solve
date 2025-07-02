import { api } from "../axios";
import { CategoryEnum } from "@/types/api";
import { BusinessType } from "@/types/api";
import { Product } from "@/types/api";
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
  // getProducts: async (params?: GetProductsParams) => {
  //   return api.get<Product[]>('/seller/products', { params });
  // },

  getOrders: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    return api.get("/seller/orders", { params });
  },

  getBusinessInfo: async () => {
    return api.get("/seller/profile/bussinessInfo");
  },

  getSellers: async () => {
    return api.get("/seller/sellers");
  },

  getSeller: async (userId: string) => {
    return api.get(`/seller/seller/${userId}`);
  },

  updateBusinessInfo: (data: BusinessInfo) =>
    api.put("/seller/profile/bussinessInfo", data),

  reqApproval: async () => {
    return api.put("/seller/approval");
  },

  getApproval: async () => {
    return api.get("/seller/approval");
  },

  updateGoalsAndMetrics: (data: GoalsAndMetrics) =>
    api.post("/seller/goals-metrics", data),
};

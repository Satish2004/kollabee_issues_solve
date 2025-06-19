import { api } from "../axios";

export interface Supplier {
  id: string;
  businessName: string;
  businessDescription?: string;
  rating: number;
  location?: string;
  user: {
    id: string;
    name: string;
    email: string;
    imageUrl?: string;
  };
  types: ('CART' | 'ORDER' | 'PROJECT' | 'CONVERSATION')[];
  primaryType: 'CART' | 'ORDER' | 'PROJECT' | 'CONVERSATION';
  lastInteraction?: string;
  interactionCount: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface Filters {
  type: string;
  search: string;
  sortBy: string;
  sortOrder: string;
}

export interface MySuppliersResponse {
  suppliers: Supplier[];
  pagination: PaginationInfo;
  filters: Filters;
}

export interface SupplierStats {
  cart: number;
  order: number;
  project: number;
  conversation: number;
  total: number;
}

export interface SupplierStatsResponse {
  stats: SupplierStats;
}

export const mySuppliersApi = {
  // Get my suppliers with filtering, pagination, and search
  getMySuppliers: async (params?: {
    type?: 'ALL' | 'CART' | 'ORDER' | 'PROJECT' | 'CONVERSATION';
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: 'businessName' | 'rating' | 'interactionCount' | 'lastInteraction';
    sortOrder?: 'asc' | 'desc';
  }): Promise<MySuppliersResponse> => {
    const response = await api.get("/my-suppliers", { params });
    return response as any;
  },

  // Get supplier statistics
  getSupplierStats: async (): Promise<SupplierStatsResponse> => {
    const response = await api.get("/my-suppliers/stats");
    return response as any;
  }
}; 
import { api } from "../axios";

export const userApi = {
  getProfile: async () => {
    return api.get("/users/profile");
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
    return api.put("/users/profile", data);
  },

  // for admin only

  getUsers: async (params?: {
    pageNo?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    filter?: string;
  }) => {
    return api.get("/admin/users", { params });
  },

  approveOrReject: async (status: boolean, id: string) => {
    return api.post(`/admin/seller/approve`, { sellerId: id, status });
  },
};

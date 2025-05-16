import { api } from "../axios";

export const inviteApi = {
  sendInvite: async (email: string) => {
    return api.post("/invite", { emails: email });
  },

  getInvites: async (params?: {
    pageNo?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    return api.get("/invite", { params });
  },
};

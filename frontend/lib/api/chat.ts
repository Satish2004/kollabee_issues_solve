import { api } from "../axios"
import { removeToken } from "../utils/token";
import Cookies from "js-cookie";


const authUrl = process.env.NEXT_PUBLIC_API_URL;


export const chatApi = {
  // Conversations
  getConversations: async (type?: "BUYER" | "SELLER" | "ADMIN", status?: "PENDING" | "ACCEPTED" | "DECLINED") => {
    let url = "/conversations"
    const params = new URLSearchParams()

    if (type) params.append("type", type)
    if (status) params.append("status", status)

    if (params.toString()) {
      url += `?${params.toString()}`
    }

    return api.get(url)
  },

  createConversation: async (data: {
    participantId: string
    participantType: "BUYER" | "SELLER" | "ADMIN"
    initialMessage?: string
    attachments?: string[]
  }) => {
    return api.post("/conversations", data)
  },

  acceptConversation: async (conversationId: string) => {
    return api.put(`/conversations/${conversationId}/accept`)
  },

  declineConversation: async (conversationId: string) => {
    return api.put(`/conversations/${conversationId}/decline`)
  },

  // Messages
  getMessages: async (conversationId: string) => {
    return api.get(`/messages?conversationId=${conversationId}`)
  },

  // Users
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

  getUsers: async (role?: "BUYER" | "SELLER" | "ADMIN") => {
    return api.get(`/users${role ? `?role=${role}` : ""}`)
  },

  // File uploads
  uploadFiles: async (files: File[]) => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append("files", file)
    })
    return api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },

  
  // Admin functionality
  blockCommunication: async (data: { initiatorId: string; targetId: string; reason?: string }) => {
    return api.post("/admin/block-communication", data)
  },

  unblockCommunication: async (data: { initiatorId: string; targetId: string }) => {
    return api.post("/admin/unblock-communication", data)
  },

  getBlockedCommunications: async () => {
    return api.get("/admin/blocked-communications")
  },
}



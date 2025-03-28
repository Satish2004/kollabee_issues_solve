import { api } from "../axios"

export const chatApi = {
  // Conversations
  getConversations: async (type?: "BUYER" | "SELLER", status?: "PENDING" | "ACCEPTED" | "DECLINED") => {
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
    participantType: "BUYER" | "SELLER"
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
    return api.get("/users/me")
  },

  getUsers: async (role?: "BUYER" | "SELLER") => {
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
}


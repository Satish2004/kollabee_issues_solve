import { api } from "../axios"

export const chatApi = {
  // Conversations
  getConversations: async (type?: "buyer" | "seller") => {
    return api.get(`/conversations${type ? `?type=${type}` : ""}`)
  },

  createConversation: async (data: { participantId: string; participantType: "buyer" | "seller" }) => {
    return api.post("/conversations", data)
  },

  // Messages
  getMessages: async (conversationId: string) => {
    return api.get(`/messages?conversationId=${conversationId}`)
  },

  // Users
  getCurrentUser: async () => {
    return api.get("/users/me")
  },

  getUsers: async (role?: "buyer" | "seller") => {
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


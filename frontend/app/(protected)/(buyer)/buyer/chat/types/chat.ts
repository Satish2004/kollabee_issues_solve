export interface User {
    id: string
    name: string
    email: string
    avatar?: string
    role: "buyer" | "seller" | "admin"
  }
  
  export interface Message {
    id: string
    conversationId: string
    content: string
    senderId: string
    senderName: string
    senderType: "buyer" | "seller" | "admin"
    attachments?: string[]
    createdAt: string
    updatedAt?: string
    status?: "pending" | "sent" | "delivered" | "read"
  }
  
  export interface Conversation {
    id: string
    participantId: string
    participantName: string
    participantType: "buyer" | "seller" | "admin"
    participantAvatar?: string
    lastMessage?: string
    lastMessageTime?: string
    unreadCount?: number
    isOnline?: boolean
  }
  
  
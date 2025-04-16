export interface User {
    id: string
    name: string
    email: string
    avatar?: string
    role: "BUYER" | "SELLER" | "ADMIN"
  }
  
  export interface Message {
    id: string
    conversationId: string
    content: string
    senderId: string
    senderName: string
    senderType: "BUYER" | "SELLER" | "ADMIN"
    attachments?: string[]
    createdAt: string
    updatedAt?: string
    status?: "pending" | "sent" | "delivered" | "read"
  }
  
  export interface Conversation {
    id: string
    participantId: string
    participantName: string
    participantType: "BUYER" | "SELLER" | "ADMIN"
    participantAvatar?: string
    lastMessage?: string
    lastMessageTime?: string
    unreadCount?: number
    isOnline?: boolean
    status: "PENDING" | "ACCEPTED" | "DECLINED"
    initiatedBy: string
  }
  
  export interface BlockedCommunication {
    id: string
    initiatorId: string
    targetId: string
    reason?: string
    blockedBy: string
    createdAt: string
    updatedAt: string
    initiator: {
      id: string
      name: string
      email: string
      role: "buyer" | "seller" | "admin"
      avatar?: string
    }
    target: {
      id: string
      name: string
      email: string
      role: "buyer" | "seller" | "admin"
      avatar?: string
    }
  }
  
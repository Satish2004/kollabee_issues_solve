import type { Server, Socket } from "socket.io"
import type { PrismaClient } from "@prisma/client"

export function handleSocketConnection(socket: Socket, io: Server, prisma: PrismaClient) {
  let userId: string | null = null

  // Handle user identification (without authentication)
  socket.on("identify", async (data: { userId: string }) => {
    userId = data.userId

    console.log(`User identified: ${userId}`)

    // Update user's online status
    if (userId) {
      await prisma.conversationParticipant.updateMany({
        where: { userId },
        data: { isOnline: true },
      })

      // Join user to rooms for their conversations
      await joinUserRooms(socket, userId, prisma)

      // Notify other users that this user is online
      await notifyUserOnline(socket, userId, prisma)
    }
  })

  // Handle disconnection
  socket.on("disconnect", async () => {
    if (userId) {
      console.log(`User disconnected: ${userId}`)

      // Update user's online status
      await prisma.conversationParticipant.updateMany({
        where: { userId },
        data: {
          isOnline: false,
          lastSeen: new Date(),
        },
      })

      // Notify other users that this user is offline
      await notifyUserOffline(socket, userId, prisma)
    }
  })

  // Handle sending a message
  socket.on("send_message", async (messageData) => {
    try {
      const { conversationId, content, senderId, senderName, senderType, attachments = [] } = messageData

      // Validate required fields
      if (!conversationId || !senderId || (!content && (!attachments || attachments.length === 0))) {
        socket.emit("error", { message: "Missing required fields" })
        return
      }

      // Create the message
      const newMessage = await prisma.message.create({
        data: {
          conversationId,
          senderId,
          content: content || "",
          attachments: attachments || [],
        },
        include: {
          sender: true,
        },
      })

      // Update conversation's updatedAt
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      })

      // Format message for frontend
      const formattedMessage = {
        id: newMessage.id,
        conversationId: newMessage.conversationId,
        content: newMessage.content,
        senderId: newMessage.senderId,
        senderName: newMessage.sender.name,
        senderType: newMessage.sender.role,
        attachments: newMessage.attachments,
        createdAt: newMessage.createdAt.toISOString(),
        updatedAt: newMessage.updatedAt.toISOString(),
        status: "sent",
      }

      // Emit message to conversation room
      io.to(conversationId).emit("new_message", formattedMessage)

      // Also send to sender separately (for acknowledgment)
      socket.emit("message_sent", { messageId: newMessage.id, status: "sent" })
    } catch (error) {
      console.error("Error sending message:", error)
      socket.emit("error", { message: "Failed to send message" })
    }
  })

  // Mark messages as read
  socket.on("mark_as_read", async ({ conversationId }) => {
    try {
      if (!conversationId || !userId) {
        socket.emit("error", { message: "Conversation ID is required" })
        return
      }

      // Mark unread messages as read
      await prisma.message.updateMany({
        where: {
          conversationId,
          senderId: { not: userId },
          isRead: false,
        },
        data: {
          isRead: true,
        },
      })

      // Notify sender that messages have been read
      socket.to(conversationId).emit("messages_read", {
        conversationId,
        readBy: userId,
      })
    } catch (error) {
      console.error("Error marking messages as read:", error)
      socket.emit("error", { message: "Failed to mark messages as read" })
    }
  })

  // Handle typing indicator
  socket.on("typing", ({ conversationId }) => {
    socket.to(conversationId).emit("user_typing", {
      conversationId,
      userId,
    })
  })

  // Handle stop typing indicator
  socket.on("stop_typing", ({ conversationId }) => {
    socket.to(conversationId).emit("user_stop_typing", {
      conversationId,
      userId,
    })
  })
}

// Join user to socket rooms for all their conversations
async function joinUserRooms(socket: Socket, userId: string, prisma: PrismaClient) {
  try {
    const userConversations = await prisma.conversationParticipant.findMany({
      where: { userId },
      select: { conversationId: true },
    })

    userConversations.forEach(({ conversationId }) => {
      socket.join(conversationId)
    })
  } catch (error) {
    console.error("Error joining user rooms:", error)
  }
}

// Notify other users that this user is online
async function notifyUserOnline(socket: Socket, userId: string, prisma: PrismaClient) {
  try {
    const userConversations = await prisma.conversationParticipant.findMany({
      where: { userId },
      select: { conversationId: true },
    })

    userConversations.forEach(({ conversationId }) => {
      socket.to(conversationId).emit("user_status_change", {
        userId,
        isOnline: true,
      })
    })
  } catch (error) {
    console.error("Error notifying user online:", error)
  }
}

// Notify other users that this user is offline
async function notifyUserOffline(socket: Socket, userId: string, prisma: PrismaClient) {
  try {
    const userConversations = await prisma.conversationParticipant.findMany({
      where: { userId },
      select: { conversationId: true },
    })

    userConversations.forEach(({ conversationId }) => {
      socket.to(conversationId).emit("user_status_change", {
        userId,
        isOnline: false,
      })
    })
  } catch (error) {
    console.error("Error notifying user offline:", error)
  }
}


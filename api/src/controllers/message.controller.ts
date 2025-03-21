import type { Request, Response } from "express"
import prisma from '../db';

export const messageController = {
  // Get messages for a conversation
  getMessages: async (req: any, res: Response) => {
    try {
      const { conversationId } = req.query
      const { userId } = req.user;

      if (!conversationId) {
        return res.status(400).json({ error: "Conversation ID is required" })
      }

      // Check if user is a participant in this conversation
      const isParticipant = await prisma.conversationParticipant.findFirst({
        where: {
          conversationId: conversationId as string,
          userId: userId,
        },
      })

      if (!isParticipant) {
        return res.status(403).json({ error: "Not authorized to view this conversation" })
      }

      // Fetch messages
      const messages = await prisma.message.findMany({
        where: {
          conversationId: conversationId as string,
        },
        include: {
          sender: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      })

      // Format messages for the frontend
      const formattedMessages = messages.map((message) => ({
        id: message.id,
        conversationId: message.conversationId,
        content: message.content,
        senderId: message.senderId,
        senderName: message.sender.name,
        senderType: message.sender.role,
        attachments: message.attachments || [],
        createdAt: message.createdAt.toISOString(),
        updatedAt: message.updatedAt?.toISOString(),
        status: message.isRead ? "read" : "delivered",
      }))

      // Mark messages as read if they were sent to the current user
      await prisma.message.updateMany({
        where: {
          conversationId: conversationId as string,
          senderId: {
            not: userId,
          },
          isRead: false,
        },
        data: {
          isRead: true,
        },
      })

      res.status(200).json({ messages: formattedMessages })
    } catch (error) {
      console.error("Error fetching messages:", error)
      res.status(500).json({ error: "Failed to fetch messages" })
    }
  },
}


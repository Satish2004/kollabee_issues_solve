import type { Request, Response } from "express"
import prisma from '../db';

export const conversationController = {
  // Get all conversations for a user
  getConversations: async (req: any, res: Response) => {
    try {
      const { type } = req.query
      const { userId } = req.user;

      // Fetch conversations where the user is a participant
      const conversations = await prisma.conversation.findMany({
        where: {
          participants: {
            some: {
              userId: userId,
            },
          },
        },
        include: {
          participants: {
            include: {
              user: true,
            },
          },
          messages: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      })

      

      // Format conversations for the frontend
      const formattedConversations = conversations
        .map((conversation) => {
          // Find the other participant (not the current user)
          const otherParticipant = conversation.participants.find((p) => p.userId !== userId)

          // // If we're filtering by type, make sure the other participant matches
          // if (type && otherParticipant?.user.role !== type) {
          //   return null
          // }

          // Get unread count
          const unreadCount = conversation.messages.filter((m) => m.senderId !== userId && !m.isRead).length

          return {
            id: conversation.id,
            participantId: otherParticipant?.userId || "",
            participantName: otherParticipant?.user.name || "Unknown User",
            participantType: otherParticipant?.user.role || "buyer",
            participantAvatar: otherParticipant?.user.imageUrl || undefined,
            lastMessage: conversation.messages[0]?.content || undefined,
            lastMessageTime: conversation.messages[0]?.createdAt.toISOString() || undefined,
            unreadCount,
            isOnline: otherParticipant?.isOnline || false,
          }
        })
        .filter(Boolean)

      res.status(200).json({ conversations: formattedConversations })
    } catch (error) {
      console.error("Error fetching conversations:", error)
      res.status(500).json({ error: "Failed to fetch conversations" })
    }
  },

  // Create a new conversation
  createConversation: async (req: any, res: Response) => {
    
    try {
      const { participantId, participantType } = req.body
      const { userId } = req.user;

      const userExists = await prisma.user.findUnique({
        where: { id: userId },
      });

      

      if (!userExists) {
        return res.status(404).json({ error: " user does not exist" });
      }

      
  
      const participantExists = await prisma.user.findUnique({
        where: { id: participantId },
      });

      console.log(participantId)
  
      if (!participantExists) {
        return res.status(404).json({ error: "Participant does not exist" });
      }

      console.log(participantExists)

      // Check if conversation already exists
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          AND: [
            {
              participants: {
                some: {
                  userId: userId,
                },
              },
            },
            {
              participants: {
                some: {
                  userId: participantId,
                },
              },
            },
          ],
        },
        include: {
          participants: {
            include: {
              user: true,
            },
          },
        },
      })

      if (existingConversation) {
        // Find the other participant
        const otherParticipant = existingConversation.participants.find((p) => p.userId !== userId)

        return res.status(200).json({
          conversation: {
            id: existingConversation.id,
            participantId: otherParticipant?.userId || "",
            participantName: otherParticipant?.user.name || "Unknown User",
            participantType: otherParticipant?.user.role || "buyer",
            participantAvatar: otherParticipant?.user.imageUrl || undefined,
            isOnline: otherParticipant?.isOnline || false,
          },
        })
      }

      // Create new conversation
      const newConversation = await prisma.conversation.create({
        data: {
          participants: {
            create: [{ userId: userId }, { userId: participantId }],
          },
        },
        include: {
          participants: {
            include: {
              user: true,
            },
          },
        },
      })

      // Find the other participant
      const otherParticipant = newConversation.participants.find((p) => p.userId !== userId)

      res.status(201).json({
        conversation: {
          id: newConversation.id,
          participantId: otherParticipant?.userId || "",
          participantName: otherParticipant?.user.name || "Unknown User",
          participantType: otherParticipant?.user.role || "buyer",
          participantAvatar: otherParticipant?.user.imageUrl || undefined,
          isOnline: otherParticipant?.isOnline || false,
        },
      })
    } catch (error) {
      console.error("Error creating conversation:", error)
      res.status(500).json({ error: "Failed to create conversation" })
    }
  },
}


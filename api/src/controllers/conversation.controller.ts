import type { Request, Response } from "express"
import prisma from '../db';
import { conversationStatus } from "@prisma/client";

export const conversationController = {
  // Get all conversations for a user
  getConversations: async (req: any, res: Response) => {
    try {
      const { type, status } = req.query
      const { userId, role } = req.user;

      // Fetch conversations where the user is a participant
      const conversations = await prisma.conversation.findMany({
        where: {
          participants: {
            some: {
              userId: userId,
            },
          },
          ...(role === "BUYER"
            ? {
                OR: [
                  { status: "ACCEPTED" },
                  { initiatedBy: { not: userId } },
                ],
              }
            : {}),
          ...(status ? { status: status as conversationStatus } : {}),
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
          const otherParticipant = conversation.participants.find((p:any) => p.userId !== userId)

          // // If we're filtering by type, make sure the other participant matches
          // if (type && otherParticipant?.user.role !== type) {
          //   return null
          // }

          // Get unread count
          const unreadCount = conversation.messages.filter((m:any) => m.senderId !== userId && !m.isRead).length

          return {
            id: conversation.id,
            participantId: otherParticipant?.userId || "",
            participantName: otherParticipant?.user.name || "Unknown User",
            participantType: otherParticipant?.user.role || "BUYER",
            participantAvatar: otherParticipant?.user.imageUrl || undefined,
            lastMessage:
              conversation.messages[0]?.content ||
              (conversation.status === "PENDING" ? "New message request" : "No messages yet"),
            lastMessageTime: conversation.messages[0]?.createdAt.toISOString(),
            unreadCount,
            isOnline: otherParticipant?.isOnline || false,
            status: conversation.status,
            initiatedBy: conversation.initiatedBy,
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
      const { participantId, participantType, initialMessage, attachments = [] } = req.body
      const { userId } = req.user;

      const [currentUser, participant] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId } }),
        prisma.user.findUnique({ where: { id: participantId } }),
      ])

      if (!currentUser || !participant) {
        return res.status(404).json({ error: "User not found" })
      }

      // Check if communication is blocked (for buyer-seller communications only)
      if (
        (currentUser.role === "BUYER" && participant.role === "SELLER") ||
        (currentUser.role === "SELLER" && participant.role === "BUYER")
      ) {
        const isBlocked = await prisma.blockedCommunication.findFirst({
          where: {
            OR: [
              {
                initiatorId: userId,
                targetId: participantId,
              },
              {
                initiatorId: participantId,
                targetId: userId,
              },
            ],
          },
        })

        if (isBlocked) {
          return res.status(403).json({ error: "Communication between these users has been blocked by an admin" })
        }
      }

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
            status: existingConversation.status,
            initiatedBy: existingConversation.initiatedBy,
          },
        })
      }

      const result = await prisma.$transaction(async (tx) => {
        // Create the conversation
        const newConversation = await tx.conversation.create({
          data: {
            status: "PENDING",
            initiatedBy: userId,
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

        // Create the initial message
        if (initialMessage) {
          await tx.message.create({
            data: {
              conversationId: newConversation.id,
              senderId: userId,
              content: initialMessage,
              attachments: attachments,
            },
          })
        }

        return newConversation
      })

      // Find the other participant
      const otherParticipant = result.participants.find((p) => p.userId !== userId)

      res.status(201).json({
        conversation: {
          id: result.id,
          participantId: otherParticipant?.userId || "",
          participantName: otherParticipant?.user.name || "Unknown User",
          participantType: otherParticipant?.user.role || "BUYER",
          participantAvatar: otherParticipant?.user.imageUrl || undefined,
          isOnline: otherParticipant?.isOnline || false,
          status: "PENDING",
          initiatedBy: userId,
        },
      })
    } catch (error) {
      console.error("Error creating conversation:", error)
      res.status(500).json({ error: "Failed to create conversation" })
    }
  },

  // Accept a conversation request
  acceptConversation: async (req: any, res: Response) => {
    try {
      const { conversationId } = req.params
      const { userId } = req.user

      // Check if the conversation exists and the user is a participant
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          participants: {
            some: {
              userId: userId,
            },
          },
          status: "PENDING",
        },
        include: {
          participants: {
            include: {
              user: true,
            },
          },
        },
      })

      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found or already accepted" })
      }

      // Make sure the user is not the one who initiated the conversation
      if (conversation.initiatedBy === userId) {
        return res.status(403).json({ error: "You cannot accept your own conversation request" })
      }

      // Update the conversation status
      const updatedConversation = await prisma.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          status: "ACCEPTED",
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
      const otherParticipant = updatedConversation.participants.find((p) => p.userId !== userId)

      res.status(200).json({
        conversation: {
          id: updatedConversation.id,
          participantId: otherParticipant?.userId || "",
          participantName: otherParticipant?.user.name || "Unknown User",
          participantType: otherParticipant?.user.role || "BUYER",
          participantAvatar: otherParticipant?.user.imageUrl || undefined,
          isOnline: otherParticipant?.isOnline || false,
          status: "ACCEPTED",
          initiatedBy: updatedConversation.initiatedBy,
        },
      })
    } catch (error) {
      console.error("Error accepting conversation:", error)
      res.status(500).json({ error: "Failed to accept conversation" })
    }
  },

  // Decline a conversation request
  declineConversation: async (req: any, res: Response) => {
    try {
      const { conversationId } = req.params
      const { userId } = req.user

      // Check if the conversation exists and the user is a participant
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          participants: {
            some: {
              userId: userId,
            },
          },
          status: "PENDING",
        },
      })

      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found or already processed" })
      }

      // Make sure the user is not the one who initiated the conversation
      if (conversation.initiatedBy === userId) {
        return res.status(403).json({ error: "You cannot decline your own conversation request" })
      }

      // Update the conversation status
      await prisma.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          status: "DECLINED",
        },
      })

      res.status(200).json({ message: "Conversation request declined" })
    } catch (error) {
      console.error("Error declining conversation:", error)
      res.status(500).json({ error: "Failed to decline conversation" })
    }
  },
}


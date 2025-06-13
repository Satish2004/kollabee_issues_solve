import type { Response } from "express";
import prisma from "../db";
import type { conversationStatus } from "@prisma/client";

export const conversationController = {
  // Get all conversations for a user
  getConversations: async (req: any, res: Response) => {
    try {
      const { type, status } = req.query;
      const { userId, role } = req.user;

      const assistentID = process.env.ASSISTANT_ID;

      // Fetch conversations where the user is a participant
      const conversations = await prisma.conversation.findMany({
        where: {
          participants: {
            some: {
              userId: userId,
            },
          },
          ...(role === "BUYER" || role === "SELLER"
            ? {
                OR: [{ status: "ACCEPTED" }, { initiatedBy: { not: userId } }],
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
      });

      console.log("Conversations:", conversations);

      // If the user is a buyer or seller and type is ADMIN, ensure a conversation with an admin exists
      if (role === "BUYER" || role === "SELLER") {
        const admin = await prisma.user.findFirst({
          where: {
            email: "surajjbhardwaj@gmail.com",
          },
        });

        console.log("Admin user:", admin);

        if (admin) {
          const adminConversation = conversations.find((conv) =>
            conv.participants.some((p: any) => p.user.id === admin.id)
          );

          if (!adminConversation) {
            // Create a conversation with the admin
            const newConversation = await prisma.conversation.create({
              data: {
                status: "ACCEPTED", // Auto-accept admin conversations
                initiatedBy: userId,
                participants: {
                  create: [{ userId: userId }, { userId: admin.id }],
                },
              },
              include: {
                participants: {
                  include: {
                    user: true,
                  },
                },
              },
            });

            conversations.unshift({ ...newConversation, messages: [] });
          }
        }
      }

      console.dir(
        conversations.map((c) => c.participants),
        { depth: null }
      );
      // Format conversations for the frontend
      const formattedConversations = conversations
        .map((conversation) => {
          // For ADMIN tab, show the admin participant
          let otherParticipant;
          if (type === "ADMIN" && (role === "BUYER" || role === "SELLER")) {
            otherParticipant = conversation.participants.find(
              (p: any) => p.user.role === "ADMIN"
            );
          } else {
            otherParticipant = conversation.participants.find(
              (p: any) => p.userId !== userId
            );
          }

          if (!otherParticipant) return null;

          const unreadCount = conversation.messages.filter(
            (m: any) => m.senderId !== userId && !m.isRead
          ).length;

          return {
            id: conversation.id,
            participantId: otherParticipant?.userId || "",
            participantName: otherParticipant?.user.name || "Unknown User",
            participantType: otherParticipant?.user.role || "BUYER",
            participantAvatar: otherParticipant?.user.imageUrl || undefined,
            lastMessage:
              conversation.messages[0]?.content ||
              (conversation.status === "PENDING"
                ? "New message request"
                : "No messages yet"),
            lastMessageTime: conversation.messages[0]?.createdAt.toISOString(),
            unreadCount,
            isOnline: otherParticipant?.isOnline || false,
            status: conversation.status,
            initiatedBy: conversation.initiatedBy,
            isActive: otherParticipant.user.isActive,
          };
        })
        .filter(Boolean);

      res.status(200).json({ conversations: formattedConversations });
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  },

  // Create a new conversation
  createConversation: async (req: any, res: Response) => {
    try {
      const {
        participantId,
        participantType,
        initialMessage,
        attachments = [],
      } = req.body;
      const { userId, role } = req.user;

      let targetParticipantId = participantId;

      // If the participant type is ADMIN, find the admin user
      if (participantType === "ADMIN") {
        const admin = await prisma.user.findFirst({
          where: { role: "ADMIN" },
        });

        if (!admin) {
          return res.status(404).json({ error: "Admin user not found" });
        }

        targetParticipantId = admin.id;
      }

      const [currentUser, participant] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId } }),
        prisma.user.findUnique({ where: { id: targetParticipantId } }),
      ]);

      if (!currentUser || !participant) {
        return res.status(404).json({ error: "User not found" });
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
                targetId: targetParticipantId,
              },
              {
                initiatorId: targetParticipantId,
                targetId: userId,
              },
            ],
          },
        });

        if (isBlocked) {
          return res.status(403).json({
            error:
              "Communication between these users has been blocked by an admin",
          });
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
                  userId: targetParticipantId,
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
      });

      if (existingConversation) {
        const otherParticipant = existingConversation.participants.find(
          (p) => p.userId !== userId
        );

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
        });
      }

      // Set status to ACCEPTED for admin conversations
      const conversationStatus =
        participant.role === "ADMIN" ? "ACCEPTED" : "PENDING";

      const result = await prisma.$transaction(async (tx) => {
        const newConversation = await tx.conversation.create({
          data: {
            status: conversationStatus,
            initiatedBy: userId,
            participants: {
              create: [{ userId: userId }, { userId: targetParticipantId }],
            },
          },
          include: {
            participants: {
              include: {
                user: true,
              },
            },
          },
        });

        if (initialMessage) {
          await tx.message.create({
            data: {
              conversationId: newConversation.id,
              senderId: userId,
              content: initialMessage,
              attachments: attachments,
            },
          });
        }

        return newConversation;
      });

      const otherParticipant = result.participants.find(
        (p) => p.userId !== userId
      );

      res.status(201).json({
        conversation: {
          id: result.id,
          participantId: otherParticipant?.userId || "",
          participantName: otherParticipant?.user.name || "Unknown User",
          participantType: otherParticipant?.user.role || "BUYER",
          participantAvatar: otherParticipant?.user.imageUrl || undefined,
          isOnline: otherParticipant?.isOnline || false,
          status: conversationStatus,
          initiatedBy: userId,
        },
      });
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ error: "Failed to create conversation" });
    }
  },

  // Accept a conversation request
  acceptConversation: async (req: any, res: Response) => {
    try {
      const { conversationId } = req.params;
      const { userId } = req.user;

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
      });

      if (!conversation) {
        return res
          .status(404)
          .json({ error: "Conversation not found or already accepted" });
      }

      // Make sure the user is not the one who initiated the conversation
      if (conversation.initiatedBy === userId) {
        return res
          .status(403)
          .json({ error: "You cannot accept your own conversation request" });
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
      });

      // Find the other participant
      const otherParticipant = updatedConversation.participants.find(
        (p) => p.userId !== userId
      );

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
      });
    } catch (error) {
      console.error("Error accepting conversation:", error);
      res.status(500).json({ error: "Failed to accept conversation" });
    }
  },

  // Decline a conversation request
  declineConversation: async (req: any, res: Response) => {
    try {
      const { conversationId } = req.params;
      const { userId } = req.user;

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
      });

      if (!conversation) {
        return res
          .status(404)
          .json({ error: "Conversation not found or already processed" });
      }

      // Make sure the user is not the one who initiated the conversation
      if (conversation.initiatedBy === userId) {
        return res
          .status(403)
          .json({ error: "You cannot decline your own conversation request" });
      }

      // Update the conversation status
      await prisma.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          status: "DECLINED",
        },
      });

      res.status(200).json({ message: "Conversation request declined" });
    } catch (error) {
      console.error("Error declining conversation:", error);
      res.status(500).json({ error: "Failed to decline conversation" });
    }
  },
};

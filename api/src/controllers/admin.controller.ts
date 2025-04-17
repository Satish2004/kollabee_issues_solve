import type { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const adminController = {
  // Block communication between two users
  blockCommunication: async (req: any, res: Response) => {
    try {
      const { initiatorId, targetId, reason } = req.body
      const { userId } = req.user;
      // Verify the current user is an admin
      const admin = await prisma.user.findFirst({
        where: {
          id: userId,
          role: "ADMIN",
        },
      })

      if (!admin) {
        return res.status(403).json({ error: "Only admins can block communications" })
      }

      // Verify both users exist
      const [initiator, target] = await Promise.all([
        prisma.user.findUnique({ where: { id: initiatorId } }),
        prisma.user.findUnique({ where: { id: targetId } }),
      ])

      if (!initiator || !target) {
        return res.status(404).json({ error: "One or both users not found" })
      }

      // Check if communication is already blocked
      const existingBlock = await prisma.blockedCommunication.findUnique({
        where: {
          initiatorId_targetId: {
            initiatorId,
            targetId,
          },
        },
      })

      if (existingBlock) {
        return res.status(400).json({ error: "Communication already blocked" })
      }

      // Create blocked communication
      const blockedCommunication = await prisma.blockedCommunication.create({
        data: {
          initiatorId,
          targetId,
          reason,
          blockedBy: userId,
        },
      })

      res.status(201).json({ blockedCommunication })
    } catch (error) {
      console.error("Error blocking communication:", error)
      res.status(500).json({ error: "Failed to block communication" })
    }
  },

  // Unblock communication between two users
  unblockCommunication: async (req: any, res: Response) => {
    try {
      const { initiatorId, targetId } = req.body
      const { userId } = req.user;

      // Verify the current user is an admin
      const admin = await prisma.user.findFirst({
        where: {
          id: userId,
          role: "ADMIN",
        },
      })

      if (!admin) {
        return res.status(403).json({ error: "Only admins can unblock communications" })
      }

      // Delete blocked communication
      await prisma.blockedCommunication.deleteMany({
        where: {
          initiatorId,
          targetId,
        },
      })

      res.status(200).json({ message: "Communication unblocked successfully" })
    } catch (error) {
      console.error("Error unblocking communication:", error)
      res.status(500).json({ error: "Failed to unblock communication" })
    }
  },

  // Get all blocked communications
  getBlockedCommunications: async (req: any, res: Response) => {
    try {
      const { userId } = req.user;

      // Verify the current user is an admin
      const admin = await prisma.user.findFirst({
        where: {
          id: userId,
          role: "ADMIN",
        },
      })

      if (!admin) {
        return res.status(403).json({ error: "Only admins can view blocked communications" })
      }

      // Get all blocked communications with user details
      const blockedCommunications = await prisma.blockedCommunication.findMany({
        include: {
          initiator: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              imageUrl: true,
            },
          },
          target: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              imageUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      res.status(200).json({ blockedCommunications })
    } catch (error) {
      console.error("Error fetching blocked communications:", error)
      res.status(500).json({ error: "Failed to fetch blocked communications" })
    }
  },
}

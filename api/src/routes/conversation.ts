import express from "express"
import { authMiddleware } from "../middleware/auth"
import { conversationController } from "../controllers/conversation.controller"

const router = express.Router()

router.get("/", authMiddleware, conversationController.getConversations)
router.post("/", authMiddleware ,conversationController.createConversation)
router.put("/:conversationId/accept", authMiddleware, conversationController.acceptConversation)
router.put("/:conversationId/decline", authMiddleware, conversationController.declineConversation)

export default router


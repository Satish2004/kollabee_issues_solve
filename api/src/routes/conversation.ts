import express from "express"
import { authMiddleware } from "../middleware/auth"
import { conversationController } from "../controllers/conversation.controller"

const router = express.Router()

router.get("/", authMiddleware, conversationController.getConversations)
router.post("/", authMiddleware ,conversationController.createConversation)
router.put("/:conversationId/accept", conversationController.acceptConversation)
router.put("/:conversationId/decline", conversationController.declineConversation)

export default router


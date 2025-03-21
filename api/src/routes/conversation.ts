import express from "express"
import { authMiddleware } from "../middleware/auth"
import { conversationController } from "../controllers/conversation.controller"

const router = express.Router()

// GET /api/conversations
router.get("/", authMiddleware, conversationController.getConversations)

// POST /api/conversations
router.post("/", authMiddleware ,conversationController.createConversation)

export default router


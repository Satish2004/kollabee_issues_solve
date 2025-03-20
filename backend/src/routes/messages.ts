import { messageController } from "../controllers/message.controller"
import express from "express"
import { authMiddleware } from "../middleware/auth"

const router = express.Router()

// GET /api/messages
router.get("/", authMiddleware ,messageController.getMessages)

export default router


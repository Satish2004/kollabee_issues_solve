import { authMiddleware } from "../middleware/auth";
import {
  getAnswer,
  getChatHistory,
  getQuestions,
  saveMessage,
} from "../controllers/chatbot.controller";
import { Router } from "express";

const router = Router();

// Get all FAQ questions
router.get("/questions", getQuestions);

// Get answer for a specific question
router.post("/answer", authMiddleware, getAnswer);

// Protected routes (require authentication)
router.get("/history", authMiddleware, getChatHistory);
router.post("/history", authMiddleware, saveMessage);

export default router;

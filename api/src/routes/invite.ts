import express from "express";
import { authMiddleware } from "../middleware/auth";
import { getInvites, sendInvite } from "../controllers/invite.controller";

const router = express.Router();

router.get("/", authMiddleware, getInvites);
router.post("/", authMiddleware, sendInvite);

export default router;

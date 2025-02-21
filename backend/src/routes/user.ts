import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);

export default router; 
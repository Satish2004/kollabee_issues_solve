import express from 'express';
import { getUserProfile, getUsers, updateUserProfile } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/profile', authMiddleware, getUserProfile);
router.patch('/profile', authMiddleware, updateUserProfile);
router.get('/', authMiddleware, getUsers);

export default router; 


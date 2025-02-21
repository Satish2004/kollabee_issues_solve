import express from 'express';
import { signup, login, forgotPassword, resetPassword, getCurrentUser, generateOTP, verifyOTP } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', authMiddleware, getCurrentUser);
router.post('/generate-otp', generateOTP);
router.post('/verify-otp', verifyOTP);

export default router; 
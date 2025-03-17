import express from 'express';
import { createCheckoutSession, getBankDetails, addBankDetail, handlePaymentCallback, updateBankDetails } from '../controllers/payment.controller';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/checkout', authMiddleware, createCheckoutSession);
router.get('/bank-details', authMiddleware, getBankDetails);
router.post('/bank-details', authMiddleware, addBankDetail);
router.post('/callback', handlePaymentCallback);
router.post('/update-bank-details', authMiddleware, updateBankDetails);

export default router; 
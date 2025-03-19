import express from 'express';
import { createCheckoutSession, getBankDetails, addBankDetail, handlePaymentCallback, updateBankDetails, createPaymentIntent } from '../controllers/payment.controller';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/checkout', authMiddleware, createCheckoutSession);
router.get('/bank-details', authMiddleware, getBankDetails);
router.post('/bank-details', authMiddleware, addBankDetail);
router.post('/callback', handlePaymentCallback);
router.post('/update-bank-details', authMiddleware, updateBankDetails);
router.post('/create-payment-intent', authMiddleware, createPaymentIntent);

export default router; 
import express from 'express';
import { 
  getSellerProducts, 
  getSellerOrders, 
  updateBusinessInfo, 
  getBusinessInfo, 
  getSellers,
  getSeller
} from '../controllers/seller.controller';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/business', authMiddleware, getBusinessInfo);
router.put('/business', authMiddleware, updateBusinessInfo);
router.get('/products', authMiddleware, getSellerProducts);
router.get('/orders', authMiddleware, getSellerOrders);
router.get('/sellers', getSellers);
router.get('/seller', getSeller);

export default router; 
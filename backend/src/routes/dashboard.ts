import express from 'express';
import { 
  getMetrics, 
  getOrderAnalytics, 
  getTopBuyers 
} from '../controllers/dashboard.controller';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/metrics', authMiddleware, getMetrics);
router.get('/order-analytics', authMiddleware, getOrderAnalytics);
router.get('/top-buyers', authMiddleware, getTopBuyers);

export default router; 
import express from 'express';
import { 
  getProductReviews, 
  addReview, 
  updateReview, 
  deleteReview 
} from '../controllers/review.controller';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', authMiddleware, addReview);
router.put('/:reviewId', authMiddleware, updateReview);
router.delete('/:reviewId', authMiddleware, deleteReview);

export default router; 
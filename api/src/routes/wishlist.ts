import express from 'express';
import { 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist,
  clearWishlist 
} from '../controllers/wishlist.controller';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', authMiddleware, getWishlist);
router.post('/', authMiddleware, addToWishlist);
router.delete('/items/:itemId', authMiddleware, removeFromWishlist);
router.delete('/', authMiddleware, clearWishlist);

export default router; 
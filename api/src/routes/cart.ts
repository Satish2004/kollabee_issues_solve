import express from 'express';
import { 
  getCart,
  addToCart, 
  updateCartItem,
  removeFromCart,
  clearCart 
} from '../controllers/cart.controller';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', authMiddleware, getCart);
router.post('/', authMiddleware, addToCart);
router.put('/items/:itemId', authMiddleware, updateCartItem);
router.delete('/items/:itemId', authMiddleware, removeFromCart);
router.delete('/', authMiddleware, clearCart);

export default router; 
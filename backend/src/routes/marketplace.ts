import express from 'express';
import { 
  getProducts, 
  getCategories,
  getRelatedProducts 
} from '../controllers/marketplace.controller';

const router = express.Router();

router.get('/products', getProducts);
router.get('/categories', getCategories);
router.get('/products/:productId/related', getRelatedProducts);

export default router; 
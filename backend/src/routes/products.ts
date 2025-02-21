import express from 'express';
import { 
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  buyProduct,
  getSearchSuggestions
} from '../controllers/products.controller';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes
router.use(authMiddleware);

// Product management
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.post('/:id/buy', buyProduct);
router.get("/searchsuggestions",getSearchSuggestions);


// Stock management

// Product attributes


// Product images


// Reviews

export default router; 
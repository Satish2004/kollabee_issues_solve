import express from 'express';
import { 
  getAllCategories, 
  getCategoryById, 
  createCategory,
  updateCategory,
  deleteCategory 
} from '../controllers/category.controller';
import { isAuthenticated, isAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Protected admin routes
router.post('/', isAuthenticated, isAdmin, createCategory);
router.put('/:id', isAuthenticated, isAdmin, updateCategory);
router.delete('/:id', isAuthenticated, isAdmin, deleteCategory);

export default router; 
import express from 'express';
import { 
  getAddresses, 
  createAddress, 
  updateAddress, 
  deleteAddress 
} from '../controllers/address.controller';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', authMiddleware, getAddresses);
router.post('/', authMiddleware, createAddress);
router.put('/:addressId', authMiddleware, updateAddress);
router.delete('/:addressId', authMiddleware, deleteAddress);

export default router; 
import express from 'express';
import { createRequest, getAllRequests, getRequestById, updateRequest, deleteRequest } from '../controllers/request.controller';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, createRequest);
router.get('/', authMiddleware, getAllRequests);
router.get('/:id', authMiddleware, getRequestById);
router.put('/:id', authMiddleware, updateRequest);
router.delete('/:id', authMiddleware, deleteRequest);
export default router; 
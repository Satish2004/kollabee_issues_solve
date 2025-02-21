import express from 'express';
import { createRequest } from '../controllers/request.controller';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, createRequest);

export default router; 
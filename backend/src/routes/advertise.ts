import express from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  createAdvertisement,
  getAdvertisements
} from '../controllers/advertise.controller';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createAdvertisement);
router.get('/', getAdvertisements);

export default router; 
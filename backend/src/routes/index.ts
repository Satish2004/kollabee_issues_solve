import { Express } from 'express';
import authRoutes from './auth';
import productRoutes from './products';
import orderRoutes from './orders';
import cartRoutes from './cart';
import wishlistRoutes from './wishlist';
import sellerRoutes from './seller';
import paymentRoutes from './payment';
import userRoutes from './user';
import addressRoutes from './address';
import reviewRoutes from './review';
import dashboardRoutes from './dashboard';
import marketplaceRoutes from './marketplace';
import uploadRoutes from './upload';
import advertiseRoutes from './advertise';
import categoryRoutes from './category';  
import requestRoutes from './request';
import conversationRoutes from './conversation';
import messagesRoutes from './messages';
export const setupRoutes = (app: Express) => {
  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/wishlist', wishlistRoutes);
  app.use('/api/seller', sellerRoutes);
  app.use('/api/payment', paymentRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/addresses', addressRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/marketplace', marketplaceRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/advertise', advertiseRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/requests', requestRoutes);
  app.use('/api/conversations', conversationRoutes);
  app.use('/api/messages', messagesRoutes);

  // Health check route
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });
}; 
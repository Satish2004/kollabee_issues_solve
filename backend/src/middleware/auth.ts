import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../db';

interface JWTPayload {
  userId: string;
  role: string;
  buyerId?: string;
  sellerId?: string;
}

export const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const isAdmin = async (req: any, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export const isSeller = async (req: any, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'SELLER') {
    return res.status(403).json({ message: 'Seller access required' });
  }
  next();
};

export const isBuyer = async (req: any, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'BUYER') {
    return res.status(403).json({ message: 'Buyer access required' });
  }
  next();
};

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    console.log(decoded)
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}; 
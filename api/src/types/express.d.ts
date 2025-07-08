import { User, Buyer, Seller } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;          // UUID from User table
        userId: string;      // Same as id, but more explicit
        role: 'BUYER' | 'SELLER' | 'ADMIN';  // Strictly typed roles
        buyerId?: string;    // Optional, present for BUYER role
        sellerId?: string;   // Optional, present for SELLER role
        email?: string;      // From User table
        name?: string;       // From User table
      } & Partial<Pick<User, 'email' | 'name' | 'companyName'>>;
    }
  }
}

// This empty export makes the file a module
export {};
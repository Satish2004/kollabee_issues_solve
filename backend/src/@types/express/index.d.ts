import { JwtPayload } from 'jsonwebtoken';

declare namespace Express {
  export interface Request {
    user: {
      userId: string;
      role: string;
      buyerId?: string;
      sellerId?: string;
    }
  }
} 
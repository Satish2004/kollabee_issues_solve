
declare global {
  namespace Express {
    interface Request {
      user: {
        userId: string;
        role: string;
        buyerId?: string;
        sellerId?: string;
      }
    }
  }
}

export {} 
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../db";

declare module "jsonwebtoken";

interface JWTPayload {
  userId: string;
  role: string;
  buyerId?: string;
  sellerId?: string;
}

// Helper function to extract token from request
const getTokenFromRequest = (req: Request): string | null => {
  // First try to get token from cookies (more secure)
  const cookieToken = req.cookies && req.cookies["auth-token"];
  if (cookieToken) return cookieToken;

  // Fall back to Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return null;
};

// Main authentication middleware that verifies the token and attaches user to request
export const isAuthenticated = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        seller: true,
        buyer: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach full user object to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Simplified middleware that only verifies token without database lookup
export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    console.log("Decoded token:", decoded);

    // Attach decoded token data to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

// Role-based middleware functions
export const isAdmin = (req: any, res: Response, next: NextFunction) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

export const isSeller = (req: any, res: Response, next: NextFunction) => {
  if (req.user?.role !== "SELLER") {
    return res.status(403).json({ message: "Seller access required" });
  }
  next();
};

export const isBuyer = (req: any, res: Response, next: NextFunction) => {
  if (req.user?.role !== "BUYER") {
    return res.status(403).json({ message: "Buyer access required" });
  }
  next();
};

// Combined middleware for role-based access
export const hasRole = (roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

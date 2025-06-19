import express from "express";
import { getMySuppliers, getSupplierStats } from "../controllers/my-suppliers.controller";
import { authMiddleware, isAuthenticated, isBuyer } from "../middleware/auth";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get my suppliers with filtering, pagination, and search
router.get("/", isAuthenticated, isBuyer, getMySuppliers);

// Get supplier statistics
router.get("/stats", isAuthenticated, isBuyer, getSupplierStats);

export default router; 
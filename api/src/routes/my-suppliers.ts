import express from "express";
import { getMySuppliers, getSupplierStats } from "../controllers/my-suppliers.controller";
import { authMiddleware, isAuthenticated, isBuyer } from "../middleware/auth";

const router = express.Router();

router.use(authMiddleware);

router.get("/", isAuthenticated, isBuyer, getMySuppliers);

router.get("/stats", isAuthenticated, isBuyer, getSupplierStats);

export default router; 
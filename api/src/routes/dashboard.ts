import express from "express";
import {
  getMetrics,
  getOrderAnalytics,
  getTopBuyers,
  getDashboard,
  getNotifications,
  getLatestOrders,
  getContacts,
} from "../controllers/dashboard.controller";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.get("/metrics", authMiddleware, getMetrics);
router.get("/order-analytics", authMiddleware, getOrderAnalytics);
router.get("/top-buyers", authMiddleware, getTopBuyers);
router.get("/", authMiddleware, getDashboard);

// New routes for dashboard components
router.get("/notifications", authMiddleware, getNotifications);
router.get("/orders", authMiddleware, getLatestOrders);
router.get("/contacts", authMiddleware, getContacts);

export default router;

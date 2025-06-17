import express from "express";
import {
  getMetrics,
  getOrderAnalytics,
  getTopBuyers,
  getDashboard,
  getNotifications,
  getBuyerNotifications,
  getLatestOrders,
  getContacts,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getOrderSummary,
} from "../controllers/dashboard.controller";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.get("/metrics", authMiddleware, getMetrics);
router.get("/order-analytics", authMiddleware, getOrderAnalytics);
router.get("/order-summary", authMiddleware, getOrderSummary);
router.get("/top-buyers", authMiddleware, getTopBuyers);
router.get("/", authMiddleware, getDashboard);

// New routes for dashboard components
router.get("/notifications", authMiddleware, getNotifications);
router.get("/buyer-notifications", authMiddleware, getBuyerNotifications);
router.get("/orders", authMiddleware, getLatestOrders);
router.get("/contacts", authMiddleware, getContacts);

// Notification management routes
router.patch("/notifications/:notificationId/read", authMiddleware, markNotificationAsRead);
router.patch("/notifications/mark-all-read", authMiddleware, markAllNotificationsAsRead);

export default router;

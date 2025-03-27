import express from "express";
import {
  createOrder,
  getOrders,
  getOrderDetails,
  updateOrderStatus,
  updateOrderTracking,
  getOrderTracking,
  acceptOrder,
  declineOrder,
  getOrdersForSeller,
} from "../controllers/order.controller";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

// Buyer routes
router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getOrders);

router.get("/seller", authMiddleware, getOrdersForSeller);
router.get("/:id", authMiddleware, getOrderDetails);

// Seller routes
router.patch("/:id/status", authMiddleware, updateOrderStatus);
router.patch("/:id/tracking", authMiddleware, updateOrderTracking);

// Public tracking route (no auth required)
router.get("/track/:id", getOrderTracking);
router.get("/track", getOrderTracking); // For tracking by tracking number
router.put("/:id/accept", authMiddleware, acceptOrder);
router.put("/:id/decline", authMiddleware, declineOrder);

export default router;

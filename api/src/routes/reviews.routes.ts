import { Router } from "express";
import {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
} from "../controllers/reviews.controller";
import { authMiddleware, isBuyer } from "../middleware/auth";

const router = Router();

// Get reviews for a product
router.get("/product/:productId", getProductReviews);

// Add a review (buyer only)
router.post("/product/:productId", authMiddleware, isBuyer, addReview);

// Update a review (buyer only)
router.put("/:reviewId", authMiddleware, isBuyer, updateReview);

// Delete a review (buyer only)
router.delete("/:reviewId", authMiddleware, isBuyer, deleteReview);

export default router; 
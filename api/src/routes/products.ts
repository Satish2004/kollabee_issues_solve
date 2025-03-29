import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  buyProduct,
  getSearchSuggestions,
  approveOrRejectProduct,
  // updateProductStatus
} from "../controllers/products.controller";
import { authMiddleware, isAuthenticated, isSeller } from "../middleware/auth";

const router = express.Router();

// Public routes (for buyers)
router.get("/search", getProducts); // Will only return active products

// Protected seller routes
router.get("/", isAuthenticated, getProducts);
router.get("/admin/:productId", getProductById);

router.get("/:productId", isAuthenticated, getProductById);
router.post("/approve-or-reject/:productId", approveOrRejectProduct);

// router.patch('/:id/status', isAuthenticated, isSeller, updateProductStatus);

// Protected routes
router.use(authMiddleware);

// Product management
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.post("/:id/buy", buyProduct);
router.get("/searchsuggestions", getSearchSuggestions);

// Stock management

// Product attributes

// Product images

// Reviews

export default router;

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
} from "../controllers/products.controller";
import { authMiddleware, isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.get("/search", getProducts);

router.get("/", isAuthenticated, getProducts);
router.get("/admin/:productId", getProductById);

router.get("/:productId", isAuthenticated, getProductById);
router.post("/approve-or-reject/:productId", approveOrRejectProduct);


router.use(authMiddleware);

router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.post("/:id/buy", buyProduct);
router.get("/searchsuggestions", getSearchSuggestions);


export default router;

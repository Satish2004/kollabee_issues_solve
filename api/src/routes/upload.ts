import express from "express";
import {
  uploadProfileImage,
  uploadProductImage,
  uploadPDF,
  deleteImage,
} from "../controllers/upload.controller";
import { authMiddleware } from "../middleware/auth";
import { upload } from "../utils/multer";

const router = express.Router();

router.post(
  "/profile-image",
  authMiddleware,
  upload.single("image"), // 'image' is the field name in form data
  uploadProfileImage
);

router.post(
  "/product-image",
  authMiddleware,
  upload.single("image"),
  uploadProductImage
);


router.post("/product-doc", authMiddleware, upload.single("pdf"), uploadPDF);

router.delete("/delete-image", authMiddleware, deleteImage);

export default router;

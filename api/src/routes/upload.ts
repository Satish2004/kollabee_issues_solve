import express from "express";
import {
  uploadProfileImage,
  uploadProductImage,
  uploadPDF,
  deleteImage,
  uploadMultipleFiles,
  uploadAnyFile,
} from "../controllers/upload.controller";
import { authMiddleware } from "../middleware/auth";
import { upload, videoUpload } from "../utils/multer";

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

router.post(
  "/multiple-files",
  authMiddleware,
  upload.array("files"), // 'files' is the field name in form data
  uploadMultipleFiles
);

router.post(
  "/any-file",
  authMiddleware,
  videoUpload.single("file"), // 'file' is the field name in form data
  uploadAnyFile
);

router.delete("/delete-image", authMiddleware, deleteImage);

export default router;

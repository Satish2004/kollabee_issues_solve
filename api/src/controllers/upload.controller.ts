import { Request, Response } from "express";
import { uploadToCloudinary } from "../utils/multer";
import { v2 as cloudinary } from "cloudinary";

export const uploadProfileImage = async (req: any, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result: any = await uploadToCloudinary(
      req.file.buffer,
      "profile-images"
    );

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Upload profile image error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

export const uploadProductImage = async (req: any, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const isImage = req.file.mimetype.startsWith("image/");
    const resourceType = isImage ? "image" : "raw";

    const result: any = await uploadToCloudinary(
      req.file.buffer,
      "product-images",
      {
        resource_type: resourceType,
      }
    );

    console.log("Product image upload result:", result);

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Upload product image error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

export const uploadPDF = async (req: any, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result: any = await uploadToCloudinary(
      req.file.buffer,
      "pdf-documents",
      {
        resource_type: "raw", // Explicitly set resource_type to "raw" for PDFs
      }
    );

    console.log("PDF upload result:", result);

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Upload PDF error:", error);
    res.status(500).json({ error: "Failed to upload PDF" });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const { cloudinaryLink } = req.body;

    if (!cloudinaryLink) {
      return res.status(400).json({ error: "Cloudinary link is required" });
    }

    const publicId = cloudinaryLink.split("/").pop()?.split(".")[0];
    console.log("Public ID:", publicId);

    if (!publicId) {
      return res.status(400).json({ error: "Invalid Cloudinary link" });
    }

    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
    });
    console.log("Delete document response:", response);

    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Delete document error:", error);
    res.status(500).json({ error: "Failed to delete document" });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { cloudinaryLink } = req.body;

    if (!cloudinaryLink) {
      return res.status(400).json({ error: "Cloudinary link is required" });
    }

    const publicId = cloudinaryLink.split("/").pop()?.split(".")[0];
    console.log("Public ID:", publicId);

    if (!publicId) {
      return res.status(400).json({ error: "Invalid Cloudinary link" });
    }

    const data = await cloudinary.uploader.destroy(
      "product-images/" + publicId,
      {
        resource_type: "image",
      }
    );
    console.log("Delete image response:", data);

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Delete image error:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
};

export const uploadMultipleFiles = async (req: any, res: Response) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const uploadResults = await Promise.all(
      req.files.map((file: any) => {
        const isImage = file.mimetype.startsWith("image/");
        const resourceType = isImage ? "image" : "raw";
        return uploadToCloudinary(file.buffer, "multi-files", {
          resource_type: resourceType,
        });
      })
    );

    res.json({
      files: uploadResults.map((result: any) => ({
        url: result.secure_url,
        public_id: result.public_id,
      })),
    });
  } catch (error) {
    console.error("Upload multiple files error:", error);
    res.status(500).json({ error: "Failed to upload files" });
  }
};

export const uploadAnyFile = async (req: any, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const isImage = req.file.mimetype.startsWith("image/");
    const isVideo = req.file.mimetype.startsWith("video/");
    const isAudio = req.file.mimetype.startsWith("audio/");
    const folder = isImage
      ? "any-files/images"
      : isVideo
      ? "any-files/videos"
      : isAudio
      ? "any-files/audios"
      : "any-files/others";

    const resourceType = isImage
      ? "image"
      : isVideo
      ? "video"
      : isAudio
      ? "audio"
      : "raw";

    const result: any = await uploadToCloudinary(req.file.buffer, folder, {
      resource_type: resourceType,
    });

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Upload any file error:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
};

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

    if (!publicId) {
      return res.status(400).json({ error: "Invalid Cloudinary link" });
    }

    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });

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

    if (!publicId) {
      return res.status(400).json({ error: "Invalid Cloudinary link" });
    }

    await cloudinary.uploader.destroy(publicId);

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Delete image error:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
};

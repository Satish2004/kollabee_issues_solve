// upload.controller.ts
import { Request, Response } from 'express';

export const uploadProfileImage = async (req: any, res: Response) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    console.log('Request file:', req.file);
    console.log('Request headers:', req.headers);

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // With Cloudinary storage, the URL is directly available in req.file.path
    res.json({ 
      url: req.file.path, // Cloudinary URL
      public_id: req.file.filename // Cloudinary public ID
    });
  } catch (error) {
    console.error('Upload profile image error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};

export const uploadProductImage = async (req: any, res: Response) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    console.log('Request file:', req.file);
    console.log('Request headers:', req.headers);

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // With Cloudinary storage, the URL is directly available in req.file.path
    res.json({ 
      url: req.file.path, // Cloudinary URL
      public_id: req.file.filename // Cloudinary public ID
    });
  } catch (error) {
    console.error('Upload product image error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};
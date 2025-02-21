import { Request, Response } from 'express';
import { uploadToCloudinary } from '../utils/cloudinary';
import fs from 'fs';
import path from 'path';

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

    // Upload to cloudinary
    const result = await uploadToCloudinary(file.path, 'profile-images');

    // Delete file from local storage after upload
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Upload profile image error:', error);
    // Clean up file if it exists
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
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

    // Upload to cloudinary
    const result = await uploadToCloudinary(file.path, 'product-images');

    // Delete file from local storage after upload
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Upload product image error:', error);
    // Clean up file if it exists
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to upload image' });
  }
}; 
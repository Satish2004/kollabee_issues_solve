import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Define proper types for the CloudinaryStorage params
interface StorageParams {
  folder: string;
  allowed_formats: string[];
  transformation: Array<{
    width: number;
    height: number;
    crop: string;
  }>;
  public_id: (req: Express.Request, file: Express.Multer.File) => string;
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage with proper type annotation
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    resource_type: 'auto',
    folder: 'kollabee',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    format: async (req: Express.Request, file: Express.Multer.File) => 'png', // or get from file.mimetype
    public_id: (req: Express.Request, file: Express.Multer.File) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return `${file.fieldname}-${uniqueSuffix}`;
    }
  } as any // temporary type assertion until we properly extend the types
});

// Keep your existing file filter
const fileFilter = (req: any, file: any, cb: any) => {
  console.log('Multer file filter:', file);
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});
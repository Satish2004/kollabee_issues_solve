import { api } from "../axios";
import { uploadPDF } from "../../../api/src/controllers/upload.controller";

export const uploadApi = {
  uploadProfileImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post("/upload/profile-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  uploadProductImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post("/upload/product-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  uploadPDF: async (file: File) => {
    const formData = new FormData();
    formData.append("pdf", file);
    return api.post("/upload/product-doc", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  deleteImage: async (publicId: string) => {
    return api.delete("/upload/delete-image", {
      data: { cloudinaryLink: publicId },
    });
  },
};

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

  uploadMultipleFiles: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file); // 'files' is the field name in form data
    });
    return api.post("/upload/multiple-files", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  uploadAnyFile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file); // 'file' is the field name in form data
    return api.post("/upload/any-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

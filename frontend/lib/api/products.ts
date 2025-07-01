import { api } from "../axios";
import { Product } from "@/types/api";

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  wholesalePrice: number;
  minOrderQuantity: number;
  availableQuantity: number;
  images: string[];
  categoryId: string;
  attributes?: {
    material?: string;
    fabricWeight?: string;
    technics?: string;
    color?: string;
    fabricType?: string;
    fitType?: string;
  };
  isDraft?: boolean;
}

export const productsApi = {
  getProducts: async (params?: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
    status?: "ACTIVE" | "DRAFT";
  }) => {
    console.log("Received filters:", params);
    return api.get("/products", { params });
  },

  getProductDetails: async (id: string) => {
    return api.get(`/products/${id}`);
  },

  // getSimilarProducts: async (id: string) => {
  //   return api.get(`/products/${id}/similar`);
  // },

  // getCategories: async () => {
  //   return api.get('/products/categories');
  // },

  getSearchSuggestions: async (query: string) => {
    return api.get("/products/suggestions", { params: { query } });
  },
  updateProduct: async (id: string, data: any) => {
    return api.put(`/products/${id}`, data);
  },
  deleteProduct: async (id: string) => {
    return api.delete(`/products/${id}`);
  },
  buyProduct: async (id: string) => {
    return api.post(`/products/${id}/buy`);
  },
  create: async (data: CreateProductData) => {
    return api.post<Product>("/products", data);
  },
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post<{ url: string }>("/upload/product-image", formData, {
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

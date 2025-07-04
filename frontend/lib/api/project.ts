import type { Project } from "../../types/api";
import { api } from "../axios";

// Define filter types
export interface ProjectFilters {
  page?: number;
  limit?: number;
  category?: string;
  budget?: string; // Format: "min-max"
  timeline?: string;
}

export interface SellerFilters {
  search?: string;
  minRating?: number;
  maxRating?: number;
  country?: string;
  supplierTypes?: string[]; // Will be joined with commas
  sortBy?: "rating" | "age" | "name";
  sortOrder?: "asc" | "desc";
  minAge?: number;
  maxAge?: number;
  priceRange?: string; // Format: "min-max"
  category?: string; // Project category for supplier matching
}

const projectApi = {
  createProject: async (data: Project) => {
    return api.post("/projects", data);
  },

  getProjects: async (filters?: ProjectFilters) => {
    return api.get("/projects", { params: filters });
  },

  getProjectDetails: async (id: string) => {
    return api.get(`/projects/${id}`);
  },

  updateProject: async (id: string, data: Project) => {
    return api.put(`/projects/${id}`, data);
  },

  deleteProject: async (id: string) => {
    return api.delete(`/projects/${id}`);
  },

  suggestedSellers: async (id: string, filters?: SellerFilters) => {
    try {
      // Convert supplierTypes array to comma-separated string if it exists
      const params = {
        ...filters,
        supplierTypes: filters?.supplierTypes?.join(","),
      };

      const response = await api.get(`/projects/seller/${id}`, { params });
      console.log("API response:", response);

      // Check if response has data property
      if (response && response.data) {
        return response.data;
      }

      // If no data property, return the response itself (for backward compatibility)
      return response;
    } catch (error) {
      console.error("Error in suggestedSellers API call:", error);
      throw error;
    }
  },

  // Save a seller to a project
  saveSeller: async ({
    sellerId,
    projectId,
  }: {
    sellerId: string;
    projectId: string;
  }) => {
    try {
      const response = await api.post("/projects/save-seller", {
        sellerId,
        projectId,
      });
      return response.data;
    } catch (error) {
      console.error("Error saving seller:", error);
      throw error;
    }
  },

  // Get saved sellers for a project
  getSavedSellers: async (projectId: string) => {
    try {
      const response = await api.get(`/projects/saved-sellers/${projectId}`);
      return response;
    } catch (error) {
      console.error("Error fetching saved sellers:", error);
      throw error;
    }
  },

  // Remove a saved seller from a project
  removeSavedSeller: async ({
    sellerId,
    projectId,
  }: {
    sellerId: string;
    projectId: string;
  }) => {
    try {
      const response = await api.post("/projects/remove-saved-seller", {
        sellerId,
        projectId,
      });
      return response.data;
    } catch (error) {
      console.error("Error removing saved seller:", error);
      throw error;
    }
  },

  sendRequest: async ({
    sellerId,
    projectId,
  }: {
    sellerId: string;
    projectId: string;
  }) => {
    try {
      const response = await api.post("/projects/send-request", {
        sellerId,
        projectId,
      });
      return response.data;
    } catch (error) {
      console.error("Error sending request to seller:", error);
      throw error;
    }
  },

  getRequestedSellers: async (projectId: string) => {
    try {
      const response = await api.get(
        `/projects/requested-sellers/${projectId}`
      );
      return response;
    } catch (error) {
      console.error("Error fetching requested sellers:", error);
      throw error;
    }
  },
  getHiredSellers: async (id: string) => {
    try {
      const response = await api.get(`/projects/hired/${id}`);
      return response;
    } catch (error) {
      console.error("Error fetching hired sellers:", error);
      throw error;
    }
  },
};

export default projectApi;

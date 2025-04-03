import { Project } from "../../types/api";
import { api } from "../axios";

const projectApi = {
  createProject: async (data: Project) => {
    return api.post("/projects", data);
  },
  getProjects: async (params?: { page?: number; limit?: number }) => {
    return api.get("/projects", { params });
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
};

export default projectApi;

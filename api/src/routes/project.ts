import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  suggestedSellers,
} from "../controllers/project.controller";
import {
  authMiddleware,
  isAuthenticated,
  isBuyer,
  isSeller,
} from "../middleware/auth";

const router = express.Router();
router.use(authMiddleware);

router.post("/", isAuthenticated, createProject);
router.get("/", isAuthenticated, getProjects);
router.get("/seller/:id", isAuthenticated, suggestedSellers);

router.get("/:id", isBuyer, getProjectById);
router.put("/:id", isAuthenticated, updateProject);
router.delete("/:id", isAuthenticated, deleteProject);

export default router;

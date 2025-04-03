import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/project.controller";
import {
  authMiddleware,
  isAuthenticated,
  isBuyer,
  isSeller,
} from "../middleware/auth";

const router = express.Router();
router.use(authMiddleware);

router.post("/", isBuyer, createProject);
router.get("/", isBuyer, getProjects);
router.get("/:id", isBuyer, getProjectById);
router.put("/:id", isBuyer, updateProject);
router.delete("/:id", isBuyer, deleteProject);

export default router;

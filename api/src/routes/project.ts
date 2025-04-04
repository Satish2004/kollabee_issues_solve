import express, { Response } from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  suggestedSellers,
  saveSeller,
  getSavedSellers,
  removeSavedSeller,
  sendRequest,
} from "../controllers/project.controller";
import { authMiddleware, isAuthenticated, isBuyer } from "../middleware/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = express.Router();
router.use(authMiddleware);

// Project CRUD routes
router.post("/", isAuthenticated, createProject);
router.get("/", isAuthenticated, getProjects);
router.get("/:id", isBuyer, getProjectById);
router.put("/:id", isAuthenticated, updateProject);
router.delete("/:id", isAuthenticated, deleteProject);

// Seller management routes
router.get("/seller/:id", isAuthenticated, suggestedSellers);
router.post("/save-seller", isAuthenticated, saveSeller);
router.get("/saved-sellers/:id", isAuthenticated, getSavedSellers);
router.post("/remove-saved-seller", isAuthenticated, removeSavedSeller);
router.post("/send-request", isAuthenticated, sendRequest);

// Add a new route to get requested sellers
router.get(
  "/requested-sellers/:id",
  isAuthenticated,
  async (req: any, res: Response) => {
    try {
      const { id } = req.params;

      console.log("Fetching requested sellers for project ID:", id);
      console.log("Buyer ID from request:", req.user.buyerId);

      // Find all requests for this project
      const requests = await prisma.projectReq.findMany({
        where: {
          projectId: id,
        },
        include: {
          seller: {
            include: {
              user: true,
            },
          },
        },
      });

      console.log("Requested sellers:", requests);

      // Map to the same format as other seller endpoints
      const requestedSellers = requests.map((request) => request.seller);

      res.status(200).json(requestedSellers);
    } catch (error) {
      console.error("Error fetching requested sellers:", error);
      res.status(500).json({ error: "Failed to fetch requested sellers" });
    }
  }
);

export default router;

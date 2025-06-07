import express from "express";
import {
  getSellerProducts,
  getSellerOrders,
  updateBusinessInfo,
  getBusinessInfo,
  getSellers,
  getSeller,
  getProfileCompletion,
  requestApproval,
  getSellerBusinessInfo,
  updateSellerBussinessInfo,
  getSellerGoalsMetric,
  updateSellerGoalsMetric,
  getBusinessOverview,
  updateBusinessOverview,
  getCapabilitiesOperations,
  updateCapabilitiesOperations,
  deleteFactoryImage,
  getComplianceCredentials,
  updateComplianceCredentials,
  getBrandPresence,
  updateBrandPresence,
  deleteProjectImage,
  getProfileSummary,
  getPendingStepNames,
  getApproval,
} from "../controllers/seller.controller";
import { authMiddleware } from "../middleware/auth";
import { upload } from "../utils/multer";

const router = express.Router();

router.get("/business", authMiddleware, getBusinessInfo);
router.put("/business", authMiddleware, updateBusinessInfo);
router.get("/products", authMiddleware, getSellerProducts);
router.get("/orders", authMiddleware, getSellerOrders);
router.get("/sellers", getSellers);
router.get("/seller", getSeller);
// router.get('/profile', getSellerProfile);
// router.put('/profile', updateSellerProfile);

router.get("/profile/bussinessInfo", authMiddleware, getSellerBusinessInfo);
router.put("/profile/bussinessInfo", authMiddleware, updateSellerBussinessInfo);

router.get("/profile/goalsMetric", authMiddleware, getSellerGoalsMetric);
router.put("/profile/goalsMetric", authMiddleware, updateSellerGoalsMetric);

// Step 4: Business Overview
router.get("/profile/business-overview", authMiddleware, getBusinessOverview);
router.put(
  "/profile/business-overview",
  authMiddleware,
  upload.single("logo"),
  updateBusinessOverview
);

// Step 5: Capabilities & Operations
router.get(
  "/profile/capabilities-operations",
  authMiddleware,
  getCapabilitiesOperations
);
router.put(
  "/profile/capabilities-operations",
  authMiddleware,
  upload.array("factoryImages", 5),
  updateCapabilitiesOperations
);
router.delete("/profile/factory-image", authMiddleware, deleteFactoryImage);

// Step 6: Compliance & Credentials
router.get(
  "/profile/compliance-credentials",
  authMiddleware,
  getComplianceCredentials
);
router.put(
  "/profile/compliance-credentials",
  authMiddleware,
  upload.fields([
    { name: "businessRegistration", maxCount: 1 },
    { name: "certifications", maxCount: 5 },
    { name: "clientLogos", maxCount: 5 },
  ]),
  updateComplianceCredentials
);

// Step 7: Brand Presence
router.get("/profile/brand-presence", authMiddleware, getBrandPresence);
router.put(
  "/profile/brand-presence",
  authMiddleware,
  upload.fields([
    { name: "projectImages", maxCount: 10 },
    { name: "brandVideo", maxCount: 1 },
  ]),
  updateBrandPresence
);
router.delete("/profile/project-image", authMiddleware, deleteProjectImage);

// Step 8: Final Review & Submit
router.get("/profile/summary", authMiddleware, getProfileSummary);

// Profile completion and approval
router.get("/profile/completion", authMiddleware, getProfileCompletion);
router.get("/profile/pending-steps", authMiddleware, getPendingStepNames);
router.get("/approval", authMiddleware, getApproval);

router.post("/approval", authMiddleware, requestApproval);

router.get("/profile/completion", authMiddleware, getProfileCompletion);

router.put("/approval", authMiddleware, requestApproval);
export default router;

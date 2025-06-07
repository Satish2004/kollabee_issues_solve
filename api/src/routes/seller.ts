import express from "express";
import {
  getSellerProducts,
  getSellerOrders,
  updateBusinessInfo,
  getBusinessInfo,
  getSellers,
  getSeller,
  getSellerProfileCategories,
  updateSellerProfileCategories,
  getSellerProfileProductionServices,
  updateSellerProfileProductionServices,
  getSellerProfileProductionManagement,
  updateSellerProfileProductionManagement,
  getSellerProfileManufacturingLocations,
  updateSellerProfileManufacturingLocations,
  getSellerProfileCapabilities,
  updateSellerProfileCapabilities,
  getSellerProfileTargetAudience,
  updateSellerProfileTargetAudience,
  getSellerProfileTeamSize,
  updateSellerProfileTeamSize,
  getSellerProfileAnnualRevenue,
  updateSellerProfileAnnualRevenue,
  getSellerProfileMinimumOrder,
  updateSellerProfileMinimumOrder,
  getSellerProfileComments,
  updateSellerProfileComments,
  uploadProfileCertificate,
  getAllProfileCertificates,
  deleteProfileCertificate,
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

// router.get("/profile/categories", authMiddleware, getSellerProfileCategories);
// router.put(
//   "/profile/categories",
//   authMiddleware,
//   updateSellerProfileCategories
// );
// router.get(
//   "/profile/production-services",
//   authMiddleware,
//   getSellerProfileProductionServices
// );
// router.put(
//   "/profile/production-services",
//   authMiddleware,
//   updateSellerProfileProductionServices
// );
// router.get(
//   "/profile/production-management",
//   authMiddleware,
//   getSellerProfileProductionManagement
// );
// router.put(
//   "/profile/production-management",
//   authMiddleware,
//   updateSellerProfileProductionManagement
// );
// router.get(
//   "/profile/manufacturing-locations",
//   authMiddleware,
//   getSellerProfileManufacturingLocations
// );
// router.put(
//   "/profile/manufacturing-locations",
//   authMiddleware,
//   updateSellerProfileManufacturingLocations
// );
// router.get(
//   "/profile/capabilities",
//   authMiddleware,
//   getSellerProfileCapabilities
// );
// router.put(
//   "/profile/capabilities",
//   authMiddleware,
//   updateSellerProfileCapabilities
// );
// router.get(
//   "/profile/target-audience",
//   authMiddleware,
//   getSellerProfileTargetAudience
// );
// router.put(
//   "/profile/target-audience",
//   authMiddleware,
//   updateSellerProfileTargetAudience
// );
// router.get("/profile/team-size", authMiddleware, getSellerProfileTeamSize);
// router.put("/profile/team-size", authMiddleware, updateSellerProfileTeamSize);
// router.get(
//   "/profile/annual-revenue",
//   authMiddleware,
//   getSellerProfileAnnualRevenue
// );
// router.put(
//   "/profile/annual-revenue",
//   authMiddleware,
//   updateSellerProfileAnnualRevenue
// );
// router.get(
//   "/profile/minimum-order",
//   authMiddleware,
//   getSellerProfileMinimumOrder
// );
// router.put(
//   "/profile/minimum-order",
//   authMiddleware,
//   updateSellerProfileMinimumOrder
// );
// router.get("/profile/comments", authMiddleware, getSellerProfileComments);
// router.put("/profile/comments", authMiddleware, updateSellerProfileComments);
// // router.get('/profile/certificates', authMiddleware, getSellerProfileCertificates);
// // router.put('/profile/certificates', authMiddleware, updateSellerProfileCertificates);
// router.post(
//   "/profile/certificates",
//   authMiddleware,
//   upload.single("image"),
//   uploadProfileCertificate
// );
// router.get("/profile/certificates", authMiddleware, getAllProfileCertificates);
// router.delete(
//   "/profile/certificates/:id",
//   authMiddleware,
//   deleteProfileCertificate
// );
router.get("/profile/completion", authMiddleware, getProfileCompletion);

router.put("/approval", authMiddleware, requestApproval);
export default router;

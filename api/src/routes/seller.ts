import express from 'express';
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
  updateSellerProfileComments
} from '../controllers/seller.controller';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/business', authMiddleware, getBusinessInfo);
router.put('/business', authMiddleware, updateBusinessInfo);
router.get('/products', authMiddleware, getSellerProducts);
router.get('/orders', authMiddleware, getSellerOrders);
router.get('/sellers', getSellers);
router.get('/seller', getSeller);
// router.get('/profile', getSellerProfile);
// router.put('/profile', updateSellerProfile);
router.get('/profile/categories', authMiddleware, getSellerProfileCategories);
router.put('/profile/categories', authMiddleware, updateSellerProfileCategories);
router.get('/profile/production-services', authMiddleware, getSellerProfileProductionServices);
router.put('/profile/production-services', authMiddleware, updateSellerProfileProductionServices);
router.get('/profile/production-management', authMiddleware, getSellerProfileProductionManagement);
router.put('/profile/production-management', authMiddleware, updateSellerProfileProductionManagement);
router.get('/profile/manufacturing-locations', authMiddleware, getSellerProfileManufacturingLocations);
router.put('/profile/manufacturing-locations', authMiddleware, updateSellerProfileManufacturingLocations);
router.get('/profile/capabilities', authMiddleware, getSellerProfileCapabilities);
router.put('/profile/capabilities', authMiddleware, updateSellerProfileCapabilities);
router.get('/profile/target-audience', authMiddleware, getSellerProfileTargetAudience);
router.put('/profile/target-audience', authMiddleware, updateSellerProfileTargetAudience);
router.get('/profile/team-size', authMiddleware, getSellerProfileTeamSize);
router.put('/profile/team-size', authMiddleware, updateSellerProfileTeamSize);
router.get('/profile/annual-revenue', authMiddleware, getSellerProfileAnnualRevenue);
router.put('/profile/annual-revenue', authMiddleware, updateSellerProfileAnnualRevenue);
router.get('/profile/minimum-order', authMiddleware, getSellerProfileMinimumOrder);
router.put('/profile/minimum-order', authMiddleware, updateSellerProfileMinimumOrder);
router.get('/profile/comments', authMiddleware, getSellerProfileComments);
router.put('/profile/comments', authMiddleware, updateSellerProfileComments);
// router.get('/profile/certificates', authMiddleware, getSellerProfileCertificates);
// router.put('/profile/certificates', authMiddleware, updateSellerProfileCertificates);

export default router; 
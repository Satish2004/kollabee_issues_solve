import express, { Response } from "express";
import { authMiddleware, isAdmin } from "../middleware/auth";
import { getAllUsers } from "../controllers/user.controller";
import {
  approveOrRejectSeller,
  getAllBuyers,
  getAllSellers,
  requestApproval,
} from "../controllers/seller.controller";
import {
  getAllDetails,
  getOrderDetails,
  getOrderDetailsForAdmin,
} from "../controllers/order.controller";
import { adminController } from "../controllers/admin.controller";

const router = express.Router();

router.get("/users", getAllUsers);
router.get("/sellers", getAllSellers);
router.get("buyer", getAllBuyers);
router.get("/order/:id", getOrderDetailsForAdmin);

/*

this api is for all, orders (buyer's order), request(marketplace req), projectReq(manufactoring req), and projects as well, just make sure while filtering you're shairng your actual filter field that exist in schema

Test JSON for orders

{
  "type": "orders",
  "pageNo": 1,
  "pageSize": 10,
  "search": "tracking123",
  "sortBy": "createdAt",
  "sortOrder": "desc",
  "filter": "status:PENDING,country:USA"
}

Test JSON for projectReq

{
  "type": "projectReq",
  "pageNo": 1,
  "pageSize": 10,
  "search": "APPROVED",
  "sortBy": "updatedAt",
  "sortOrder": "asc",
  "filter": "status:APPROVED"
}

Test JSON for projects

{
  "type": "projects",
  "pageNo": 1,
  "pageSize": 10,
  "search": "businessName123",
  "sortBy": "createdAt",
  "sortOrder": "desc",
  "filter": "category:Technology"
}



Test JSON for requests
{
  "type": "requests",
  "pageNo": 1,
  "pageSize": 10,
  "search": "productName123",
  "sortBy": "createdAt",
  "sortOrder": "asc",
  "filter": "category:Electronics"
}

Explanation:
type: Specifies the type of data to fetch (orders, projectReq, projects, or requests).
pageNo: Page number for pagination.
pageSize: Number of items per page.
search: Search term for specific fields.
sortBy: Field to sort by (e.g., createdAt, updatedAt).
sortOrder: Sorting order (asc or desc).
filter: Comma-separated filters for specific fields (e.g., status, country, category).



*/
router.get("/getAllDetails", getAllDetails);

// this is for approving or rejecting the seller (make sure to call this api, only if the seller is completed the onboarding process)
router.post("/seller/approve", approveOrRejectSeller);

router.get("/", async (req: any, res: Response) => {
  console.log("req.user : ", req.user);
  return res.status(200).json({
    message: "Welcome to the admin dashboard",
    user: req.user,
  });
});

// Block communication between two users
router.post(
  "/block-communication",
  authMiddleware,
  adminController.blockCommunication
);

// Unblock communication between two users
router.post(
  "/unblock-communication",
  authMiddleware,
  adminController.unblockCommunication
);

// Get all blocked communications
router.get(
  "/blocked-communications",
  authMiddleware,
  adminController.getBlockedCommunications
);

export default router;

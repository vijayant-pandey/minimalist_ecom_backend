// backend/routes/adminRoutes.js
import express from "express";
import {
  getAllOrders,
  getOrderByIdAdmin,
  updateOrderStatus,
  getAllUsers,
  updateUserRole
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// protect + admin only
router.use(protect, authorizeRoles("admin"));

// Orders
router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderByIdAdmin);
router.put("/orders/:id/status", updateOrderStatus);

// Users
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);

export default router;

import express from "express";
import { createOrder, getOrders, getOrderById } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";



const router = express.Router();
router.use(protect);

// Create a new order
router.post("/", createOrder);

//  Get all user orders
router.get("/", getOrders);

//  Get single order details
router.get("/:id", getOrderById);


export default router;

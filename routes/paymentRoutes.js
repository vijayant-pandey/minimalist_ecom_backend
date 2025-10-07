import express from "express";
import { confirmOrder, createCheckoutSession } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-checkout-session", protect, createCheckoutSession);
router.post("/confirm", protect, confirmOrder);


export default router;

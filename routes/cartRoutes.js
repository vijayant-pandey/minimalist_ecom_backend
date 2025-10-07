import express from "express";
import { addToCart, getCart, updateCart, removeFromCart } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getCart);
router.post("/", addToCart);
router.put("/", updateCart);
router.delete("/", removeFromCart);

export default router;

import express from "express";
import { createOrder, getMyOrders, getOrderById } from "../controllers/orderController.js";
import { protect } from "../middleware/auth.js";
 

const router = express.Router();

// ✅ ใช้ protect เพื่อเชื่อมกับ user จาก token
router.post("/", protect, createOrder);
router.get("/me", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

export default router;


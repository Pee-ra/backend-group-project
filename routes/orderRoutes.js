import express from "express";
import { createOrder, getMyOrders } from "../controllers/orderController.js";
import { authUser } from "../middleware/authUser.js";
import { cancelMyOrder } from "../controllers/orderController.js";

const router = express.Router();

// ✅ ใช้ protect เพื่อเชื่อมกับ user จาก token
router.post("/", authUser(), createOrder);
router.get("/me", authUser(), getMyOrders);
router.delete("/me/:id", authUser(), cancelMyOrder);

export default router;


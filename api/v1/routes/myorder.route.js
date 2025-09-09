import express from "express";
import {
  createOrder,
  deleteOrder,
  getMyOrder,
  searchOrder,
  updateOrderStatus,
} from "../controllers/myorder.controller.js";

const router = express.Router();
router.post("/", createOrder);
router.get("/search", searchOrder);
router.put("/:orderId/status", updateOrderStatus);
router.get("/:userId", getMyOrder);
router.delete("/:orderId", deleteOrder);
export default router;

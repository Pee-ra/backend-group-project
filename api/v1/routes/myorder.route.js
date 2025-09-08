import express from "express";
import {
  createOrder,
  deleteOrder,
  getMyOrder,
  searchOrder,
} from "../controllers/myorder.controller.js";

const router = express.Router();
router.post("/", createOrder);
router.get("/search", searchOrder);
router.get("/:userId", getMyOrder);
router.delete("/:orderId", deleteOrder);
export default router;

import express from "express";
import {
  deleteOrder,
  getAllOrder,
  searchOrder,
} from "../controllers/myorder.controller.js";

const router = express.Router();
router.get("/orders/:userId", getAllOrder);
router.delete("/orders/:userId", deleteOrder);
router.search("/orders/search", searchOrder);
export default router;

import express from "express";
import {
  createItem,
  getAllItems,
  getItem,
  deleteItem,
  editItem,
} from "../controllers/item.controller.js";
// import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/admin/washingitems", getAllItems);
router.get("/admin/washingitems/:itemId", getItem);
router.post("/admin/washingitems", createItem);
router.put("/admin/washingitems/:itemId", editItem);
router.delete("/admin/washingitems/:itemId", deleteItem);

export default router;

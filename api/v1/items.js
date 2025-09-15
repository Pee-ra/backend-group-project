import express from "express";
import {
  createItem,
  deleteItem,
  editItem,
  getItem,
} from "./controllers/items.controller.js";

const router = express.Router();

router.get("/", getItem);
router.post("/", createItem);
router.put("/:id", editItem);
router.delete("/:id", deleteItem);

export default router;

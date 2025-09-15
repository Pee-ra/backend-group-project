import express from "express";
import {
  createService,
  deleteService,
  editService,
  getAllService,
  getService,
} from "./controllers/services.controller.js";


const router = express.Router();
router.get("/", getAllService);
router.get("/:id", getService);
router.post("/", createService);
router.put("/:id", editService);
router.delete("/:id", deleteService);

export default router;

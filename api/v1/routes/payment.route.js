import express from "express";
import { cretePayment } from "../controllers/payment.controller.js";
import { getMyOrder } from "../controllers/myorder.controller.js";

const router = express.Router();
router.post("/:orderId", cretePayment);
router.get("/:orderId", getMyOrder);
export default router;

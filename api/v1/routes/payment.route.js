import express from "express";
import { cretePayment } from "../controllers/payment.controller.js";

const router = express.Router();
router.post("/payment", cretePayment);

export default router;

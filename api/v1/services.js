import express from "express";
import { Service } from "../../models/Service.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try { res.json(await Service.find({})); } catch (err) { next(err); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const s = await Service.findById(req.params.id);
    if (!s) return res.status(404).json({ error: true, message: "Service not found" });
    res.json(s);
  } catch (err) { next(err); }
});

router.post("/", async (req, res, next) => {
  try { const s = await Service.create(req.body); res.status(201).json(s); } catch (err) { next(err); }
});

router.put("/:id", async (req, res, next) => {
  try { const s = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(s); } catch (err) { next(err); }
});

router.delete("/:id", async (req, res, next) => {
  try { await Service.findByIdAndDelete(req.params.id); res.json({ success: true }); } catch (err) { next(err); }
});

export default router;
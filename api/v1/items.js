import express from "express";
import { WashingItem } from "../../models/WashingItem.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try { res.json(await WashingItem.find({}));
    } catch (err) {
        next(err);
    }
});
router.post("/", async (req, res, next) => {
  try { const it = await WashingItem.create(req.body); res.status(201).json(it); } catch (err) { next(err); }
});
router.put("/:id", async (req, res, next) => {
  try { const it = await WashingItem.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(it); } catch (err) { next(err); }
});
router.delete("/:id", async (req, res, next) => {
  try { await WashingItem.findByIdAndDelete(req.params.id); res.json({ success: true }); } catch (err) { next(err); }
});

export default router;
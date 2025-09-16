import { Schema, model } from "mongoose";
import Counter from "./Counter.js";

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceType: {
      type: String,
      enum: ["per-kg", "per-piece"],
      required: true,
    },
    weightDetails: {
      kg: Number,
      price: Number,
    },
    itemDetails: [
      {
        name: String,
        quantity: Number,
        price: Number,
        subtotal: Number,
      },
    ],
    pickupDetails: {
      date: { type: Date, required: true },
      time: { type: String, required: true },
    },
    specialInstructions: String,
    customerInfo: {
      fullName: String,
      email: String,
      tel: String,
      roomNumber: String,
    },
    totalPrice: { type: Number, required: true, min: 0 },
    orderNumber: { type: String, unique: true },
    trackingNumber: { type: String, unique: true },
  },
  { timestamps: true }
);

// ✅ ใช้ counters collection เพื่อรันเลขอัตโนมัติ
orderSchema.pre("save", async function (next) {
  const year = new Date().getFullYear();

  if (!this.orderNumber) {
    const orderCounter = await Counter.findByIdAndUpdate(
      "orderNumber",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const orderSeq = orderCounter.seq.toString().padStart(4, "0");
    this.orderNumber = `ORD-${year}-${orderSeq}`;
  }

  if (!this.trackingNumber) {
    const trackCounter = await Counter.findByIdAndUpdate(
      "trackingNumber",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const trackSeq = trackCounter.seq.toString().padStart(4, "0");
    this.trackingNumber = `TRK-${year}-${trackSeq}`;
  }

  next();
});

export default model("Order", orderSchema);

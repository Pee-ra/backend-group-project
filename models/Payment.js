import { Schema, model } from "mongoose";

const Payment = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Order", // อ้างอิงถึง Collection ของคำสั่งซื้อ
  },
  createOn: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
});

export const payment = model("payment", Payment);

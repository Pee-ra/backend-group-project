import { Schema, model } from "mongoose";

const Payment = new Schema({
  userId: { type: String, required: true },
  orderId: { type: String, required: true },
  createOn: { type: Date, default: new Date().getTime() },
  service: { type: String, required: true },
  items: { type: [String], required: [] },
  amout: { type: Number, required: true },
});

export const payment = model("payment", Payment);

import { Schema, model } from "mongoose";

const counterSchema = new Schema({
  _id: { type: String, required: true }, // เช่น "orderNumber" หรือ "trackingNumber"
  seq: { type: Number, default: 0 },
});

export default model("Counter", counterSchema);

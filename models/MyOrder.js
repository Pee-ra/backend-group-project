import { Schema, Types, model } from "mongoose";

const OrderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User", // อ้างอิงถึงคอลเลกชัน 'User'
    required: true,
  },
  orderId: {
    type: Schema.Types.ObjectId,
    // 'ref' ใช้สำหรับอ้างอิงเอกสารจาก collection อื่น
    ref: "Payment",
  },
  createOn: {
    type: Date,
    default: Date.now,
  },
  orderStatus: {
    type: String,
    enum: ["Pending", "Processing", "Delivered", "Cancelled"],
    default: "Pending",
  },
  services: [
    {
      serviceType: {
        type: String,
        enum: ["เหมาถัง", "ตามชิ้น"],
        required: true,
      },
      // 'Mixed' ใช้สำหรับเก็บข้อมูลที่มีโครงสร้างยืดหยุ่น เช่น ขนาดของถัง
      details: Schema.Types.Mixed,
    },
  ],
  items: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      // เพิ่มฟิลด์ price (ราคา) เข้าไปในแต่ละรายการของ
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  notes: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  pickupDate: {
    type: Date,
  },
  deliveryDate: {
    type: Date,
  },
});

export const Order = model("Order", OrderSchema);

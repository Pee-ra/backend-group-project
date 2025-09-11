import { Schema, model } from "mongoose";

const OrderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User", // อ้างอิงถึงคอลเลกชัน 'User'
    required: true,
  },
  createOn: {
    type: Date,
    default: Date.now,
  },
  services_id: {
    type: Schema.Types.ObjectId,
    ref: "service",
    required: true,
  },
  service_items: [
    {
      items_id: {
        type: Schema.Types.ObjectId,
        ref: "items",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min:1,
      },
    },
  ],
  pickup_date: {
    type: Date,
  },
  pickup_time: {
    type: String,
  },
  notes: {
    type: String,
  },
  order_status: {
    type: String,
    enum: ["Pending", "Processing", "Delivered", "Cancelled"],
    default: "Pending",
  },
  amount: {
    type: Number,
    required: true,
  },
  delivery_date: {
    type: Date,
  },
  payment_status:{
    type: String,
    enum: ["Pending", "Paid", "Failed", "Refunded"],
    default: "Pending"
  },
  review: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 500,
    },
    reviewedAt: {
      type: Date,
      default: Date.now,
    },
  },
});

export const Order = model("Order", OrderSchema);

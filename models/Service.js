import { Schema, model } from "mongoose";

const ServiceSchema = new Schema(
    {
        service_name: {
            type: String,
            required: true
        },
        service_type: {
            type: String,
            enum: ["weight", "per_item"],
            required: true
        },
        pricePerKg: {
            type: Number,
            default: 0
        },
        perday_limit_order: {
            type: Number,
            default: 50
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);

export const Service = model("Service", ServiceSchema);
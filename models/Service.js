import { Schema, model } from "mongoose";

const ServiceSchema = new Schema(
    {
        service_name: {
            type: String,
            enum: ["คิดตามน้ำหนัก", "คิดตามรายชิ้น"],
            required: true
        },
        capacity:{
            type : Number,
            default : 0,
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
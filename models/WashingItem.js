import { Schema, model } from "mongoose";

const WashingItemSchema = new Schema(
    {
        item_name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            default: ""
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);

export const WashingItem = model("WashingItem", WashingItemSchema);
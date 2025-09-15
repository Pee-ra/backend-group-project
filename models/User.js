import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        tel: {
            type: String,
            required: true,
        },
        roomNumber: {
            type: String,
            required: true,
        },
        createdOn: {
            type: Date,
            default: new Date().getTime(),
        },
        role: {
            type: String, 
            enum: ["customer", "admin"], //ค่าต้องเป็น customer หรือ admin
            default: "customer",
        }
    }
);

UserSchema.pre("save", async function (next)  {
  if (!this.isModified("password")) return next();//check password hasn't change
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const User = model("User", UserSchema);
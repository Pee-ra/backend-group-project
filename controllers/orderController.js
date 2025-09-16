import Order from "../models/Order.js";
import mongoose from "mongoose";

export const createOrder = async (req, res) => {
  try {
    console.log("req.user =>", req.user); // ✅ debug
    console.log("req.body =>", req.body);

    const newOrder = await Order.create({
      ...req.body,
      user: req.user._id, // 👈 เอาค่า _id จาก protect
    });

    res.status(201).json({
      success: true,
      message: "สร้างคำสั่งซื้อสำเร็จ",
      data: newOrder,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id, isDeleted: { $ne: true } })
      .select("serviceType totalPrice pickupDetails specialInstructions orderNumber createdAt itemDetails")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (err) {
    next(err);
  }
};


// delete my order



export const cancelMyOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // 1) ตรวจ id ให้ถูกก่อน (กัน CastError)
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid order id" });
    }

    // 2) ต้องมี req.user จาก middleware
    if (!req.user?._id) {
      return res.status(401).json({ success: false, message: "Unauthenticated" });
    }

    // 3) สร้าง filter ตรวจสิทธิ์ใน query เลย
    const isAdmin = req.user.role === "admin";
    const filter = isAdmin
      ? { _id: id }
      : { _id: id, user: req.user._id }; // ไม่ใช่เจ้าของ => match ไม่เจอ

    // 4) อัปเดตสถานะ (soft delete)
    const now = new Date();
    const update = {
      $set: {
        status: "canceled",
        isDeleted: true,
        deletedAt: now, // ฟิลด์ใหม่ที่ตั้งใจใช้
        deleteAt: now,  // เผื่อ schema เก่ายังสะกด deleteAt
      },
    };

    const updated = await Order.findOneAndUpdate(filter, update, {
      new: true,
      strict: false,  // เผื่อฟิลด์ยังไม่อยู่ใน schema จะไม่ throw
      projection: "_id user status isDeleted deletedAt deleteAt",
    });

    // 5) เช็กผล
    if (!updated) {
      // ไม่พบ (อาจเพราะไม่ใช่เจ้าของ หรือ id ไม่เจอ)
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (updated.status !== "canceled") {
      // กันเคส edge ถ้าไม่ได้เปลี่ยนจริง
      return res.status(500).json({ success: false, message: "Failed to cancel order" });
    }

    return res.json({ success: true, message: "Order canceled" });
  } catch (err) {
    console.error("cancelMyOrder error:", err);
    return res.status(500).json({ success: false, message: err.message || "Server Error" });
  }
};



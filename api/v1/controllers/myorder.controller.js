import { Order } from "../../../models/MyOrder.js";

// get all order
export const getAllOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId: userId }).sort({ createdOn: -1 });
    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "ไม่พบคำสั่งซื้อสำหรับผู้ใช้รายนี้" });
    }
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ",
      error: error.message,
    });
  }
};

// Delete
export const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        error: true,
        message: "ไม่พบคำสั่งซื้อที่ต้องการลบ",
      });
    }

    const result = await Order.deleteOne({ _id: orderId });
    if (result.deletedCount === 0) {
      return res.status(404).json({
        error: true,
        message: "คำสั้่งซื้อถูกลบไปแล้ว",
      });
    }

    return res.status(200).json({
      error: false,
      message: "ลบคำสั่งซื้อสำเร็จแล้ว",
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "เกิดข้อผิดพลาดในการลบคำสั่งซื้อ",
      detail: err.message,
    });
  }
};

//search
export const searchOrder = async (req, res) => {
  try {
    const { userId, query } = req.query;
    if (!userId || !query) {
      return res.status(400).json({
        error: true,
        message: "กรุณาระบุ User ID และคำค้นหา",
      });
    }

    const searchRegex = new RegExp(query, "i");
    const matchingOrder = await Order.find({
      userId: userId,
      $or: [
        { "orderId" : { $regex: searchRegex }},
        { "services.serviceType": { $regex: searchRegex} },
        { "items.name": { $regex: searchRegex } },
        { "notes": { $regex: searchRegex } },
        { "pickupDate": { $regex: searchRegex} },
        { amount: parseInt(query) || null },
      ],
    });

    if (matchingOrder.length === 0){
      return res.status(404).json({
        message:"ไม่พบคำสั่งซื้อที่ตรงกับคำค้นหา"
      })
    }

    return res.json({
      error: false,
      order: matchingOrder,
      message: "ค้นหาสำเร็จ",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "เกิดข้อผิดพลาดในการค้นหา",
      detail: error.message,
    });
  }
};

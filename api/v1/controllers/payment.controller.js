import { Order } from "../../../models/MyOrder.js";
import { payment } from "../../../models/Payment.js";

// Create payment
export const cretePayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ message: "ไม่พบคำสั่งซื้อที่ต้องการชำระเงิน" });
    }

    const NewPayment = await payment.create({
      orderId: order.id,
      createOn: Date.now(),
      amount: order.amount,
    });

    order.orderStatus = "Processing";
    await order.save();

    return res.status(201).json({
      error: false,
      NewPayment,
      message: "การชำระเงินเสร็จสมบูรณ์",
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "เกิดข้อผิดพลาดในการสร้างรายการชำระเงิน",
      detail: err.message,
    });
  }
};

//
export const myPayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    const payMent = await payment.findOne({ orderId: orderId });
    if (!payMent) {
      return res.status(404).json({ message: "ไม่พบข้อมูลการคำสั่งซื้อนี้" });
    }
    res.status(200).json({
      error: false,
      payMent,
      message: "ดึงข้อมูลคำสั่งซื้อสำเร็จ",
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ",
    });
  }
};

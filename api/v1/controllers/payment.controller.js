import { Order } from "../../../models/MyOrder";
import { payment } from "../../../models/Payment";

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

import Order from "../models/Order.js";

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
    const orders = await Order.find({ user: req.user._id })
      .select("serviceType totalPrice pickupDetails specialInstructions orderNumber createdAt itemDetails")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/orders/:id
 * ดึงข้อมูลคำสั่งซื้อเดียวตาม _id หรือ orderNumber
 */
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // ลองหาด้วย _id หรือ orderNumber (รองรับทั้งสองแบบ)
    const order = await Order.findOne({
      $or: [{ _id: id }, { orderNumber: id }],
    })
      .populate("user", "fullName email")
      .lean();

    if (!order) {
      return res.status(404).json({
        error: true,
        message: "ไม่พบคำสั่งซื้อนี้",
      });
    }

    res.status(200).json({
      error: false,
      message: "ดึงข้อมูลคำสั่งซื้อสำเร็จ",
      order,
    });
  } catch (err) {
    next(err);
  }
};
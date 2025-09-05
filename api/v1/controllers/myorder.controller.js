import { Order } from "../../../models/MyOrder.js";

// get
export const getAllOrder = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1, isPinned: -1 });
    return res.json({
      error: false,
      orders,
      message: "All order retrived succesfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "Failed to fetch all orders",
      detail: err.message,
    });
  }
};

// Delete
export const deleteOrder = async (req, res) => {
  const orderId = req.params.orderId;
  const { order } = req.order;

  try {
    const order = await Order.findOne({ _id: orderId, orderId: order._id });

    if (!order) {
      return res.status(404).json({
        error: true,
        message: "Order not found",
      });
    }

    await Order.deleteOne({ _id: orderId, orderId: order._id });

    return res.json({
      error: false,
      message: "Order deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

//search
export const searchOrder = async (req, res) => {
  try {
    const matchingOrder = await Order.find({
      userId: user._id,
      $or: [
        { service: { $regex: new RegExp(Query, "i") } },
        { items: { $regex: new RegExp(Query, "i") } },
        { pickupDate: { $regex: new RegExp(Query, "i") } },
        { amout: { $regex: new RegExp(Query, "i") } },
      ],
    });

    return res.json({
      error: false,
      order: matchingOrder,
      message: "Order matching the search query retrived successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server error",
    });
  }
};

//Get order by id ??
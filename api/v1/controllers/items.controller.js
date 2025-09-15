import { WashingItem } from "../../../models/WashingItem.js";

/// Post
export const createItem = async (req, res) => {
  try {
    const newItem = await WashingItem.create(req.body);
    return res.status(201).json({
      error: false,
      newItem,
      message: "สร้างบริการสำเร็จ",
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "เกิดข้อผิดพลาดในการสร้างบริการ",
      detail: err.message,
    });
  }
};

/// Get all
export const getAllItems = async (req, res) => {
  try {
    const Items = await WashingItem.find();
    if (!Items.length) {
      return res.status(404).json({
        message: "ไม่พบบริการ",
      });
    }
    res.status(200).json(Items);
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลบริการ",
    });
  }
};

/// Get
export const getItem = async (req, res) => {
  try {
    const { itemsId } = req.params;
    const items = await WashingItem.findOne({ itemsId: itemsId });
    if (!items) {
      return res.status(404).json({
        message: "ไม่พบบริการ",
      });
    }
    res.status(200).json(items);
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลบริการ",
    });
  }
};

/// delete
export const deleteItem = async (params) => {
  try {
    const itemsId = req.params.itemsId;
    const items = await WashingItem.findById(itemsId);

    if (!items) {
      return res.status(404).json({
        error: false,
        message: "ไม่พบบริการที่ต้องการลบ",
      });
    }
    const result = await WashingItem.deleteOne({ _id: itemsId });
    if (result.deletedCount === 0) {
      return res.status(404).json({
        error: true,
        message: "บริการถูกลบเรียบร้อยไปแล้ว",
      });
    }
    return res.status(200).json({
      error: false,
      message: "ลบบริการสำเร็จแล้ว",
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "เกิดข้อผิดพลาดในการลบข้อมูล",
      detail: err.message,
    });
  }
};

/// Edit
export const editItem = async (req, res) => {
  try {
    const { itemsId } = req.params;
    const { item_name, price, description } = req.body;

    const updateItem= await WashingItem.findByIdAndUpdate(
      itemsId,
      { item_name: item_name },
      { price: price },
      { description: description }
    );
    if (!updateItem) {
      return res.status(404).json({
        message: "ไม่พบบริการที่ต้องการอัพเดท",
      });
    }
    res.status(200).json({
      updateItem,
      message: "อัพเดทสถานะสำเร็จ",
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "เกิดข้อผิดพลาดในการแก้ไขบริการ",
      detail: err.message,
    });
  }
};

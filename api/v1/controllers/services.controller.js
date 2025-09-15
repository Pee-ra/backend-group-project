import { Service } from "../../../models/Service.js";

/// Post
export const createService = async (req, res) => {
  try {
    const newService = await Service.create(req.body);
    return res.status(201).json({
      error: false,
      newService,
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
export const getAllService = async (req, res) => {
  try {
    const services = await Service.find();
    if (!services.length) {
      return res.status(404).json({
        message: "ไม่พบบริการ",
      });
    }
    res.status(200).json(services);
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลบริการ",
    });
  }
};

/// Get
export const getService = async (req, res) => {
  try {
    const { ServiceId } = req.params;
    const services = await Service.findOne({ ServiceId: ServiceId });
    if (!services) {
      return res.status(404).json({
        message: "ไม่พบบริการ",
      });
    }
    res.status(200).json(services);
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลบริการ",
    });
  }
};

/// delete
export const deleteService = async (params) => {
  try {
    const ServiceId = req.params.ServiceId;
    const service = await Service.findById(ServiceId);

    if (!order) {
      return res.status(404).json({
        error: false,
        message: "ไม่พบบริการที่ต้องการลบ",
      });
    }
    const result = await Service.deleteOne({ _id: ServiceId });
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
export const editService = async (req, res) => {
  try {
    const { ServiceId } = req.params;
    const { service_name, capacity, perday_limit_order } = req.body;

    const updateService = await Service.findByIdAndUpdate(
      ServiceId,
      { service_name: service_name },
      { capacity: capacity },
      { perday_limit_order: perday_limit_order }
    );
    if (!updateService) {
      return res.status(404).json({
        message: "ไม่พบบริการที่ต้องการอัพเดท",
      });
    }
    res.status(200).json({
      updateService,
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

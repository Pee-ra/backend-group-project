import express from "express";

const router = express.Router();

export default (db) => {
  router.get("/myorder", async (req, res) => {
    const result = await db.excecute(`
        SELECT services.*,users.name as author_name, users.email as author_email
        FROM services
        INNER JOIN users ON services.user_id = users.id
        ORDER BY services.created_at DESC
        `);

    const myorders = result.row.map((myorder) => ({
      ...services,
      orderId: services.orderId,
      orderOn: services.createOn,
      orderStatus: services.orderStatus,
      service: services.service,
      items: services.items,
      pickupDate: services.pickupDate,
      deliveryDate: services.deliveryDate,
      amout:service.amout,
    }));

    res.json(myorders);
  });
};

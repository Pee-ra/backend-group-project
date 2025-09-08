import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectMongo } from "./config/mongo.js";
import usersRoutes from "./api/v1/users.js";
import ordersRoutes from "./api/v1/routes/myorder.route.js";
// import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
//Middleware
app.use(express.json());

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
  ], // frontend domain
};
app.use(cors(corsOptions)); //CORSoPTION
app.use("/", usersRoutes);
app.use("/orders", ordersRoutes);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// centralized error handling middleware รับมาจาก catch err
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
  });
});

const port = process.env.port || 5001;

(async () => {
  try {
    await connectMongo();
    app.listen(port, () => {
      console.log(`Server running on port ${port} ✅ 🙌`);
    });
  } catch (err) {
    console.error("Startup error", err);
    process.exit(1);
  }
})();

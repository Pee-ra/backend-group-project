import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectMongo } from "./config/mongo.js";
import usersRoutes from "./api/v1/users.js";
import cookieParser from "cookie-parser";
import adminRoutes from "./api/v1/admin.js";
import orderRoutes from "./routes/orderRoutes.js";



dotenv.config();
const app = express();
//Middleware
app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser()); 
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://sprint2-project3-v2.vercel.app"
  ],
  credentials: true, // frontend domain
};
app.use(cors(corsOptions),); //CORSoPTION

// ✅ เพิ่ม health route กัน 404 ที่ root และสำหรับ health check
app.get("/", (_req, res) => {
  res.status(200).send("OK");
});
app.get("/healthz", (_req, res) => {
  res.status(200).json({ ok: true, time: new Date().toISOString() });
});

app.use("/", usersRoutes);
app.use("/adminPage", adminRoutes);
app.use("/api/v1/orders", orderRoutes);


app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
})



// centralized error handling middleware รับมาจาก catch err 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
  });
  
})



const port = process.env.PORT || 5001;



(async () => { 
  try {
    await connectMongo()
    app.listen(port, () => {
  console.log(`Server running on port ${port} ✅ 🙌`);
});
  } catch (err) {
    console.error("Startup error", err);
    process.exit(1);
  }
 })();
import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import appointmentRoutes from "./routes/appointments.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import scheduleRoutes from "./routes/schedule.js";
import serviceRoutes from "./routes/services.js";
import productRoutes from "./routes/products.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });
console.log("URI loaded:", process.env.MONGO_URI ? "yes" : "NO");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API is running"));
app.use("/api/appointments", appointmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/products", productRoutes);
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

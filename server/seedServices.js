import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Service from "./models/Service.js";
import services from "../src/data/services.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

await mongoose.connect(process.env.MONGO_URI);

await Service.deleteMany({});
await Service.insertMany(services.map((s, i) => ({ ...s, order: i + 1 })));

console.log(`Loaded ${services.length} services.`);
await mongoose.disconnect();

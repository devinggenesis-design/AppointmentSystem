import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Service from "./models/Service.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const services = [
  {
    slug: "haircut",
    name: "Haircut",
    price: 150,
    desc: "Cut, wash, and style.",
    order: 1,
  },
  {
    slug: "shave",
    name: "Shave",
    price: 100,
    desc: "Clean shave with a warm towel finish.",
    order: 2,
  },
  {
    slug: "beard",
    name: "Beard Trim",
    price: 120,
    desc: "Shape and line-up.",
    order: 3,
  },
  {
    slug: "combo",
    name: "Haircut + Beard Trim",
    price: 250,
    desc: "Any haircut plus a beard trim.",
    order: 4,
  },
  {
    slug: "color",
    name: "Hair Color",
    price: 600,
    desc: "Single-color treatment.",
    order: 5,
  },
];

await mongoose.connect(process.env.MONGO_URI);

for (const s of services) {
  await Service.updateOne(
    { slug: s.slug },
    { $setOnInsert: s },
    { upsert: true },
  );
}

console.log("Services are in the database.");
await mongoose.disconnect();

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "./models/Admin.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const [, , username, password] = process.argv;

if (!username || !password) {
  console.log("Usage: node server/seedAdmin.js <username> <password>");
  process.exit(1);
}

await mongoose.connect(process.env.MONGO_URI);

const exists = await Admin.findOne({ username: username.toLowerCase() });

if (exists) {
  console.log(`Admin "${username}" already exists.`);
} else {
  await Admin.create({
    username,
    passwordHash: await bcrypt.hash(password, 10),
  });
  console.log(`Admin "${username}" created.`);
}

await mongoose.disconnect();

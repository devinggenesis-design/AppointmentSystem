import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "Admin" },
    shopName: { type: String, default: "Barbershop" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Admin", adminSchema);

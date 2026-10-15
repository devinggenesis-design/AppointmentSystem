import mongoose from "mongoose";

const { Schema } = mongoose;

const subServiceSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    durationMinutes: { type: Number, default: 30 },
  },
  { _id: false, id: false },
);

const tierSchema = new Schema(
  {
    label: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: false, id: false },
);

const serviceSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    durationMinutes: { type: Number, default: 30 },
    icon: { type: String, default: "scissors" },
    category: { type: String, required: true },
    subServices: [subServiceSchema],
    priceTiers: [tierSchema],
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("Service", serviceSchema);

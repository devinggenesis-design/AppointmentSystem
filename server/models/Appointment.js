import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: "" },
    serviceName: { type: String, required: true },
    subServiceName: { type: String, default: "" },
    branchName: { type: String, default: "" },
    bookingDate: { type: String, required: true },
    bookingTime: { type: String, required: true },
    barberName: { type: String, default: "" },
    totalPrice: { type: Number, default: 0 },
    specialRequests: { type: String, default: "" },
    status: { type: String, default: "confirmed" },
    createdAt: {
      type: String,
      default: () => new Date().toISOString().replace("Z", ""),
    },
  },
  { versionKey: false },
);

export default mongoose.model("Appointment", bookingSchema, "bookings");

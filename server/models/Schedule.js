import mongoose from "mongoose";

const { Schema } = mongoose;

const dayOffSchema = new Schema(
  {
    id: { type: Number, required: true },
    date: { type: String, required: true },
    reason: { type: String, default: "Day off" },
  },
  { _id: false },
);

const employeeSchema = new Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, default: "Barber", trim: true },
    hours: { type: Schema.Types.Mixed, required: true },
    daysOff: [dayOffSchema],
  },
  { _id: false },
);

const scheduleSchema = new Schema(
  {
    key: { type: String, default: "main", unique: true },
    slotMinutes: { type: Number, enum: [15, 30, 45, 60], default: 30 },
    hours: { type: Schema.Types.Mixed, required: true },
    daysOff: [dayOffSchema],
    employees: [employeeSchema],
  },
  { timestamps: true },
);

export default mongoose.model("Schedule", scheduleSchema);

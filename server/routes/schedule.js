import express from "express";
import Schedule from "../models/Schedule.js";
import requireAuth from "../middleware/auth.js";

const router = express.Router();

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

const toMinutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const hoursError = (hours, owner) => {
  if (!hours || typeof hours !== "object")
    return `${owner}: hours are missing.`;

  for (const day of DAYS) {
    const d = hours[day];
    if (!d || typeof d.open !== "boolean")
      return `${owner}: ${day} is invalid.`;
    if (d.open) {
      if (!TIME.test(d.start) || !TIME.test(d.end))
        return `${owner}: ${day} has an invalid time.`;
      if (toMinutes(d.end) <= toMinutes(d.start)) {
        return `${owner}, ${day}: closing time must be after opening time.`;
      }
    }
  }
  return "";
};

const cleanDaysOff = (list) =>
  (Array.isArray(list) ? list : []).map((d) => ({
    id: Number(d.id),
    date: String(d.date),
    reason: String(d.reason || "Day off").trim(),
  }));

const toResponse = (doc) => ({
  slotMinutes: doc.slotMinutes,
  hours: doc.hours,
  daysOff: doc.daysOff,
  employees: doc.employees,
});

router.get("/", async (req, res) => {
  try {
    const doc = await Schedule.findOne({ key: "main" }).lean();
    res.json(doc ? toResponse(doc) : {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

router.put("/", requireAuth, async (req, res) => {
  try {
    const { slotMinutes, hours, daysOff, employees } = req.body;

    if (![15, 30, 45, 60].includes(Number(slotMinutes))) {
      return res.status(400).json({ message: "Invalid slot length." });
    }

    const shopErr = hoursError(hours, "Shop");
    if (shopErr) return res.status(400).json({ message: shopErr });

    const staff = Array.isArray(employees) ? employees : [];
    for (const e of staff) {
      if (!e.name || !String(e.name).trim()) {
        return res
          .status(400)
          .json({ message: "Every employee needs a name." });
      }
      const err = hoursError(e.hours, e.name);
      if (err) return res.status(400).json({ message: err });
    }

    const update = {
      slotMinutes: Number(slotMinutes),
      hours,
      daysOff: cleanDaysOff(daysOff),
      employees: staff.map((e) => ({
        id: Number(e.id),
        name: String(e.name).trim(),
        role: String(e.role || "Barber").trim(),
        hours: e.hours,
        daysOff: cleanDaysOff(e.daysOff),
      })),
    };

    const doc = await Schedule.findOneAndUpdate({ key: "main" }, update, {
      new: true,
      upsert: true,
      runValidators: true,
    }).lean();

    res.json(toResponse(doc));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

export default router;

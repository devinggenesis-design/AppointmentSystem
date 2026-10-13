import express from "express";
import Appointment from "../models/Appointment.js";
import requireAuth from "../middleware/auth.js";
import {
  toClient,
  to12h,
  to24h,
  statusToDb,
  DATE_RE,
  TIME_RE,
  CANCELLED,
} from "../utils/bookingMap.js";

const router = express.Router();

const sameDay = (date) => ({ $regex: `^${date}` });

router.get("/slots", async (req, res) => {
  try {
    const { date } = req.query;
    if (!DATE_RE.test(date || "")) {
      return res.status(400).json({ message: "A valid date is required." });
    }

    const taken = await Appointment.find({
      bookingDate: sameDay(date),
      status: { $nin: CANCELLED },
    })
      .select("bookingTime -_id")
      .lean();

    res.json(taken.map((a) => to24h(a.bookingTime)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, phone, service, price, date, time } = req.body;

    if (!name?.trim() || !phone?.trim() || !service) {
      return res
        .status(400)
        .json({ message: "Name, phone, and service are required." });
    }
    if (!DATE_RE.test(date || "") || !TIME_RE.test(time || "")) {
      return res.status(400).json({ message: "Invalid date or time." });
    }

    const sameDayBookings = await Appointment.find({
      bookingDate: sameDay(date),
      status: { $nin: CANCELLED },
    })
      .select("bookingTime")
      .lean();

    if (sameDayBookings.some((a) => to24h(a.bookingTime) === time)) {
      return res
        .status(409)
        .json({ message: "That time slot is already taken." });
    }

    const created = await Appointment.create({
      customerName: name.trim(),
      phone: phone.trim(),
      serviceName: service,
      totalPrice: Number(price) || 0,
      bookingDate: date,
      bookingTime: to12h(time),
      status: "confirmed",
    });

    res.status(201).json(toClient(created.toObject()));
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Couldn't save the booking." });
  }
});

router.get("/", requireAuth, async (req, res) => {
  try {
    const list = await Appointment.find().lean();
    const mapped = list
      .map(toClient)
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["booked", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: statusToDb(status) },
      { new: true },
    ).lean();

    if (!updated)
      return res.status(404).json({ message: "Appointment not found." });

    res.json(toClient(updated));
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Couldn't update the appointment." });
  }
});

export default router;

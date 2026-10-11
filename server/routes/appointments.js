import express from "express";
import Appointment from "../models/Appointment.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/slots", async (req, res) => {
  try {
    const { date } = req.query;
    const taken = await Appointment.find({
      date,
      status: { $ne: "cancelled" },
    }).select("time -_id");
    res.json(taken.map((a) => a.time));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { date, time } = req.body;

    const exists = await Appointment.findOne({
      date,
      time,
      status: { $ne: "cancelled" },
    });
    if (exists) {
      return res
        .status(409)
        .json({ message: "That time slot is already taken." });
    }

    const appointment = await Appointment.create(req.body);
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true },
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;

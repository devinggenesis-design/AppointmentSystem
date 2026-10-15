import express from "express";
import Service from "../models/Service.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const list = await Service.find({ active: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    res.json(
      list.map((s) => ({
        id: s.slug,
        name: s.name,
        description: s.description,
        price: s.price,
        durationMinutes: s.durationMinutes,
        icon: s.icon,
        category: s.category,
        subServices: s.subServices || [],
        priceTiers: s.priceTiers || [],
      })),
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

export default router;

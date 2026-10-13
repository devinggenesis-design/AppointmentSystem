import express from "express";
import Service from "../models/Service.js";

const router = express.Router();

// GET /api/services (public: the customer pages need it)
router.get("/", async (req, res) => {
  try {
    const list = await Service.find({ active: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    // Same shape the pages already use: id, name, price, desc
    res.json(
      list.map((s) => ({
        id: s.slug,
        name: s.name,
        price: s.price,
        desc: s.desc,
      })),
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

export default router;

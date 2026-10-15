import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const list = await Product.find({ active: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    res.json(
      list.map((p) => ({
        id: p.slug,
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        icon: p.icon,
        badge: p.badge,
        features: p.features || [],
      })),
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

export default router;

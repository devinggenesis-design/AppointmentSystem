import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import requireAuth from "../middleware/auth.js";

const router = express.Router();

const publicInfo = (a) => ({
  id: a._id,
  username: a.username,
  name: a.name,
  shopName: a.shopName,
  email: a.email,
  phone: a.phone,
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    const admin = await Admin.findOne({
      username: username.trim().toLowerCase(),
    });
    const valid = admin && (await bcrypt.compare(password, admin.passwordHash));

    if (!valid) {
      return res
        .status(401)
        .json({ message: "Incorrect username or password." });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    res.json({ token, admin: publicInfo(admin) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  const admin = await Admin.findById(req.adminId);
  if (!admin) return res.status(401).json({ message: "Not authorized." });
  res.json(publicInfo(admin));
});

// PUT /api/auth/profile
router.put("/profile", requireAuth, async (req, res) => {
  try {
    const { name, shopName, username, email = "", phone = "" } = req.body;

    if (!name?.trim())
      return res.status(400).json({ message: "Please enter your name." });
    if (!shopName?.trim())
      return res.status(400).json({ message: "Please enter the shop name." });

    const uname = (username || "").trim().toLowerCase();
    if (uname.length < 3) {
      return res
        .status(400)
        .json({ message: "Username must be at least 3 characters." });
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address." });
    }

    const taken = await Admin.findOne({
      username: uname,
      _id: { $ne: req.adminId },
    });
    if (taken)
      return res
        .status(409)
        .json({ message: "That username is already taken." });

    const admin = await Admin.findByIdAndUpdate(
      req.adminId,
      {
        name: name.trim(),
        shopName: shopName.trim(),
        username: uname,
        email: email.trim(),
        phone: phone.trim(),
      },
      { new: true },
    );
    if (!admin) return res.status(401).json({ message: "Not authorized." });

    res.json(publicInfo(admin));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// PUT /api/auth/password
router.put("/password", requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Please fill in all password fields." });
    }
    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "New password must be at least 8 characters." });
    }
    if (newPassword === currentPassword) {
      return res
        .status(400)
        .json({
          message: "New password must be different from the current one.",
        });
    }

    const admin = await Admin.findById(req.adminId);
    if (!admin) return res.status(401).json({ message: "Not authorized." });

    const ok = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!ok)
      return res
        .status(400)
        .json({ message: "Your current password is incorrect." });

    admin.passwordHash = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.json({ message: "Password updated." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

export default router;

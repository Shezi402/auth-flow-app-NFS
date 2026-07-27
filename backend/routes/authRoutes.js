import express from "express";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateSignup, validateLogin } from "../middleware/validate.js";

const router = express.Router();

// Basic brute-force protection on login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many login attempts. Try again later." },
});

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

// @route  POST /api/auth/signup
router.post("/signup", validateSignup, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during signup", error: err.message });
  }
});

// @route  POST /api/auth/login
router.post("/login", loginLimiter, validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user._id);

    res.status(200).json({
      message: "Logged in successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during login", error: err.message });
  }
});

// @route  POST /api/auth/logout
// Stateless JWT: real invalidation happens client-side by discarding the token.
// This endpoint exists so the frontend has a clean, consistent call to make on logout.
router.post("/logout", protect, (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

// @route  GET /api/auth/me  (used by protected page + route guard)
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    user: { id: req.user._id, name: req.user.name, email: req.user.email },
  });
});

export default router;

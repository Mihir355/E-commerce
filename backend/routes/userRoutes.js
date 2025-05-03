const express = require("express");
const router = express.Router();
const User = require("../models/user");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const otpStore = new Map(); // Temporarily store OTPs in memory (not recommended for production)

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // set in .env
    pass: process.env.EMAIL_PASS,
  },
});

// Send OTP to email
router.post("/login", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, otp);

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`,
    });

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email });
      await user.save();
    }

    return res
      .status(200)
      .json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send OTP" });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const storedOtp = otpStore.get(email);
  if (storedOtp !== otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ success: false, message: "User not found" });
  }

  otpStore.delete(email); // Clean up

  const token = jwt.sign({ userId: user._id }, "secret-key", {
    expiresIn: "7d",
  }); // Optional
  return res.status(200).json({ success: true, token });
});

// Update user profile
router.put("/update", async (req, res) => {
  const { email, name, gender, age } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    user.name = name;
    user.gender = gender;
    user.age = age;
    await user.save();

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get user details by email
router.get("/details/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { name, gender, age, email: userEmail } = user;
    return res.status(200).json({
      success: true,
      user: { name, gender, age, email: userEmail },
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;

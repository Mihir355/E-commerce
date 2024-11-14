const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/login", async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber || phoneNumber.length !== 10) {
    return res
      .status(400)
      .json({ success: false, message: "Phone number must be 10 digits" });
  }

  try {
    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = new User({ phoneNumber });
      await user.save();
      return res.status(201).json({
        success: true,
        message: "User created and logged in",
        userId: user._id,
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "User logged in", userId: user._id });
  } catch (error) {
    console.error("Error checking user:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/create", async (req, res) => {
  const { phoneNumber, name, gender, age } = req.body;

  if (!phoneNumber || phoneNumber.length !== 10) {
    return res
      .status(400)
      .json({ success: false, message: "Phone number must be 10 digits" });
  }

  try {
    let user = await User.findOne({ phoneNumber });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    user = new User({ phoneNumber, name, gender, age });
    await user.save();
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      userId: user._id,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/update", async (req, res) => {
  const { phoneNumber, name, gender, age } = req.body;

  if (!phoneNumber) {
    return res
      .status(400)
      .json({ success: false, message: "Phone number is required" });
  }

  try {
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot change phone number" });
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

module.exports = router;

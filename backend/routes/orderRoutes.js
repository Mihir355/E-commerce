const express = require("express");
const router = express.Router();
const Order = require("../models/orderModel");

router.post("/", async (req, res) => {
  try {
    const { email, products } = req.body;
    const newOrder = new Order({ email, products });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: "Failed to place order" });
  }
});

router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.find({ userId }).populate("products");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

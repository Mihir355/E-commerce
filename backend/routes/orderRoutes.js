const express = require("express");
const router = express.Router();
const Order = require("../models/orderModel");

router.post("/", async (req, res) => {
  try {
    const { userId, products } = req.body;
    const newOrder = new Order({ userId, products });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: "Failed to place order" });
  }
});

router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  try {
    const totalOrders = await Order.countDocuments({ userId });
    const totalPages = Math.ceil(totalOrders / limit);

    const orders = await Order.find({ userId })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("products");

    res.json({ orders, totalPages });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

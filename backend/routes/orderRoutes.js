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

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).exec();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

module.exports = router;

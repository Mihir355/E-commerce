const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");

router.get("/:subcategory", async (req, res) => {
  try {
    const { subcategory } = req.params;
    const products = await Product.find({ subcategory: subcategory });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments({ category });

    const products = await Product.find({ category }).skip(skip).limit(limit);

    res.json({
      success: true,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      products,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

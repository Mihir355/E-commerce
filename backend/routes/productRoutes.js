const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 600 }); // Cache expires in 10 minutes

// 🟩 Get products by subcategory (with caching)
router.get("/:subcategory", async (req, res) => {
  try {
    const { subcategory } = req.params;
    const cacheKey = `subcategory:${subcategory}`;

    const cached = cache.get(cacheKey);
    if (cached) {
      console.log("fetch from catch");
      return res.json(cached);
    } else {
      console.log("not cached");
      const products = await Product.find({ subcategory });
      cache.set(cacheKey, products);
      res.json(products);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🟩 Get products by category with pagination (with caching)
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const cacheKey = `category:${category}:page:${page}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const total = await Product.countDocuments({ category });
    const products = await Product.find({ category }).skip(skip).limit(limit);

    const result = {
      success: true,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      products,
    };

    cache.set(cacheKey, result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🟩 Get product by ID (with caching)
router.get("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `product:${id}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    cache.set(cacheKey, product);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

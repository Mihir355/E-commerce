const express = require("express");
const router = express.Router();
const processedProducts = require("../models/processedProducts");
const authenticateToken = require("../middleware/auth");

// Add to cart
router.post("/add", authenticateToken, async (req, res) => {
  const { userId, productId } = req.body;
  try {
    await processedProducts.updateOne(
      { userId },
      { $addToSet: { cart: productId } },
      { upsert: true }
    );
    res.status(200).json({ message: "Product added to cart" });
  } catch (err) {
    res.status(500).json({ message: "Error adding to cart", error: err });
  }
});

// Clear cart
router.post("/clear", authenticateToken, async (req, res) => {
  const { userId } = req.body;
  try {
    await processedProducts.updateOne({ userId }, { $set: { cart: [] } });
    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: "Error clearing cart", error: err });
  }
});

// Remove from cart
router.post("/remove", authenticateToken, async (req, res) => {
  const { userId, productId } = req.body;
  try {
    await processedProducts.updateOne(
      { userId },
      { $pull: { cart: productId } }
    );
    res.status(200).json({ message: "Product removed from cart" });
  } catch (err) {
    res.status(500).json({ message: "Error removing from cart", error: err });
  }
});

// Get cart with pagination
router.get("/:userId", authenticateToken, async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  try {
    const processedProduct = await processedProducts
      .findOne({ userId })
      .populate({
        path: "cart",
        options: {
          skip: (page - 1) * limit,
          limit: limit,
        },
      });

    const totalCart = await processedProducts
      .findOne({ userId })
      .populate("cart");

    const totalItems = totalCart?.cart?.length || 0;
    const totalPages = Math.ceil(totalItems / limit);

    if (!processedProduct || processedProduct.cart.length === 0) {
      return res.status(200).json({ products: [], totalPages: 0 });
    }

    res.status(200).json({ products: processedProduct.cart, totalPages });
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart", error: err });
  }
});

// Check if item is in cart
router.get("/check/:userId/:productId", authenticateToken, async (req, res) => {
  const { userId, productId } = req.params;
  try {
    const processedProduct = await processedProducts.findOne({ userId });
    if (!processedProduct) {
      return res.status(200).json({ isInCart: false });
    }

    const isInCart = processedProduct.cart.includes(productId);
    res.status(200).json({ isInCart });
  } catch (err) {
    res.status(500).json({ message: "Error checking cart", error: err });
  }
});

module.exports = router;

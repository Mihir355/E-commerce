const express = require("express");
const router = express.Router();
const processedProducts = require("../models/processedProducts");

router.post("/add", async (req, res) => {
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

router.post("/clear", async (req, res) => {
  const { userId } = req.body;
  try {
    await processedProducts.updateOne({ userId }, { $set: { cart: [] } });
    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: "Error clearing cart", error: err });
  }
});

router.post("/remove", async (req, res) => {
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

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const processedProduct = await processedProducts
      .findOne({ userId })
      .populate("cart");

    if (!processedProduct || processedProduct.cart.length === 0) {
      return res.status(200).json({ message: "Cart is empty" });
    }
    res.status(200).json(processedProduct.cart);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart", error: err });
  }
});

router.get("/check/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;
  try {
    const processedProduct = await processedProducts.findOne({ userId });
    if (!processedProduct) {
      return res.status(200).json({ isInWishlist: false });
    }

    const isInCart = processedProduct.cart.includes(productId);
    res.status(200).json({ isInCart });
  } catch (err) {
    res.status(500).json({ message: "Error checking cart", error: err });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const ProcessedProducts = require("../models/processedProducts");

router.post("/add", async (req, res) => {
  const { userId, productId } = req.body;
  try {
    await ProcessedProducts.updateOne(
      { userId },
      { $addToSet: { wishlist: productId } },
      { upsert: true }
    );
    res.status(200).json({ message: "Product added to wishlist" });
  } catch (err) {
    res.status(500).json({ message: "Error adding to wishlist", error: err });
  }
});

router.post("/remove", async (req, res) => {
  const { userId, productId } = req.body;
  try {
    await ProcessedProducts.updateOne(
      { userId },
      { $pull: { wishlist: productId } }
    );
    res.status(200).json({ message: "Product removed from wishlist" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error removing from wishlist", error: err });
  }
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  try {
    const processedProduct = await ProcessedProducts.findOne({
      userId,
    }).populate("wishlist");

    if (!processedProduct || processedProduct.wishlist.length === 0) {
      return res.status(200).json({ wishlist: [], total: 0 });
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedWishlist = processedProduct.wishlist.slice(
      startIndex,
      endIndex
    );
    const totalItems = processedProduct.wishlist.length;

    res.status(200).json({ wishlist: paginatedWishlist, total: totalItems });
  } catch (err) {
    res.status(500).json({ message: "Error fetching wishlist", error: err });
  }
});

router.get("/check/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;
  try {
    const processedProduct = await ProcessedProducts.findOne({ userId });
    if (!processedProduct) {
      return res.status(200).json({ isInWishlist: false });
    }

    const isInWishlist = processedProduct.wishlist.includes(productId);
    res.status(200).json({ isInWishlist });
  } catch (err) {
    res.status(500).json({ message: "Error checking wishlist", error: err });
  }
});

module.exports = router;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styling/wishlist.css";

const api = axios.create({
  baseURL: "https://e-commerce-dh0b.onrender.com",
});

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getUserId = () => {
    return localStorage.getItem("userId");
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const userId = getUserId();
        if (userId) {
          const response = await api.get(`/api/wishlist/${userId}`);
          setWishlistItems(response.data);
        } else {
          console.log("User not logged in");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const userId = getUserId();
      if (userId) {
        await api.post(`/api/wishlist/remove`, { userId, productId });
        setWishlistItems((prevItems) =>
          prevItems.filter((item) => item._id !== productId)
        );
      } else {
        console.log("User not logged in");
      }
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };

  const handleAddToCartAndRemoveFromWishlist = async (productId) => {
    try {
      const userId = getUserId();
      if (userId) {
        await api.post(`/api/cart/add`, { userId, productId });
        await handleRemoveFromWishlist(productId);

        alert("Item moved to cart!");
      } else {
        console.log("User not logged in");
      }
    } catch (err) {
      console.error("Error adding to cart and removing from wishlist:", err);
    }
  };

  if (loading) return <div className="wishlist-loading-spinner"></div>;

  return (
    <div className="wishlist-container">
      <h2 className="wishlist-header">Your Wishlist</h2>
      <button className="wishlist-go-back-button" onClick={() => navigate(-1)}>
        Go Back
      </button>
      {wishlistItems.length > 0 ? (
        <ul className="wishlist-items-list">
          {wishlistItems.map((product) => (
            <li key={product._id} className="wishlist-item">
              <img
                src={product.img}
                alt={product.name}
                className="wishlist-item-img"
              />
              <span className="wishlist-item-name">{product.name}</span>
              <button
                className="wishlist-item-remove-button"
                onClick={() => handleRemoveFromWishlist(product._id)}
              >
                Remove
              </button>
              <button
                className="wishlist-item-add-to-cart-button"
                onClick={() =>
                  handleAddToCartAndRemoveFromWishlist(product._id)
                }
              >
                Add to Cart
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="wishlist-empty-message">No items in wishlist.</p>
      )}
    </div>
  );
};

export default Wishlist;

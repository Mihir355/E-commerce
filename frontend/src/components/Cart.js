import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styling/cart.css";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getUserId = () => {
    return localStorage.getItem("userId");
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userId = getUserId();
        if (userId) {
          const response = await api.get(`/api/cart/${userId}`);
          setCartItems(response.data);
        } else {
          console.log("User not logged in");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cart:", err);
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleRemoveFromCart = async (productId) => {
    try {
      const userId = getUserId();
      if (userId) {
        await api.post(`/api/cart/remove`, { userId, productId });
        setCartItems((prevItems) =>
          prevItems.filter((item) => item._id !== productId)
        );
        alert("Item removed from cart!");
      } else {
        console.log("User not logged in");
      }
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  const handleBuyNow = async () => {
    try {
      const userId = getUserId();
      if (userId && cartItems.length > 0) {
        await api.post(`/api/orders`, { userId, products: cartItems });
        await api.post(`/api/cart/clear`, { userId });
        setCartItems([]);
        alert("Purchase successful! Cart has been emptied.");
      } else {
        alert("Cart is empty or user not logged in.");
      }
    } catch (err) {
      console.error("Error processing the order:", err);
    }
  };

  if (loading) return <div className="cart-loading-spinner"></div>;

  return (
    <div className="cart-container">
      <h2 className="cart-header">Your Cart</h2>
      <button className="cart-go-back-button" onClick={() => navigate(-1)}>
        Go Back
      </button>
      {cartItems.length > 0 ? (
        <>
          <ul className="cart-items-list">
            {cartItems.map((product) => (
              <li key={product._id} className="cart-item">
                <img
                  src={product.img}
                  alt={product.name}
                  className="cart-item-img"
                />
                <span className="cart-item-name">{product.name}</span>
                <button
                  className="cart-item-remove-button"
                  onClick={() => handleRemoveFromCart(product._id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button className="cart-buy-now-button" onClick={handleBuyNow}>
            Buy Now
          </button>
        </>
      ) : (
        <p className="cart-empty-message">No items in cart.</p>
      )}
    </div>
  );
};

export default Cart;

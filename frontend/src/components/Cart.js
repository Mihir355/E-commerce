import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styling/cart.css";

const api = axios.create({
  baseURL: "https://e-commerce-dh0b.onrender.com",
});

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("token");
  const getUserId = () => localStorage.getItem("userId");

  const handleUnauthorized = () => {
    alert("Unauthorized access. Please log in.");
    navigate("/");
  };

  const fetchCart = async (currentPage = 1) => {
    setLoading(true);
    try {
      const token = getToken();
      const userId = getUserId();
      if (token && userId) {
        const response = await api.get(
          `/api/cart/${userId}?page=${currentPage}&limit=5`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCartItems(response.data.products);
        setTotalPages(response.data.totalPages);
      } else {
        handleUnauthorized();
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleUnauthorized();
      } else {
        console.error("Error fetching cart:", err);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCart(page);
  }, [page]);

  const handleRemoveFromCart = async (productId) => {
    try {
      const token = getToken();
      const userId = getUserId();
      if (userId && token) {
        await api.post(
          `/api/cart/remove`,
          { userId, productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchCart(page);
        alert("Item removed from cart!");
      } else {
        handleUnauthorized();
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleUnauthorized();
      } else {
        console.error("Error removing from cart:", err);
      }
    }
  };

  const handleBuyNow = async () => {
    try {
      const token = getToken();
      const userId = getUserId();
      if (userId && token && cartItems.length > 0) {
        await api.post(
          `/api/orders`,
          { userId, products: cartItems },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await api.post(
          `/api/cart/clear`,
          { userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCartItems([]);
        alert("Purchase successful! Cart has been emptied.");
        setPage(1);
        setTotalPages(1);
      } else {
        alert("Cart is empty or user not logged in.");
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleUnauthorized();
      } else {
        console.error("Error processing the order:", err);
      }
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
          <div className="cart-pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="cart-pagination-button"
            >
              Previous
            </button>
            <span className="cart-page-info">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="cart-pagination-button"
            >
              Next
            </button>
          </div>
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

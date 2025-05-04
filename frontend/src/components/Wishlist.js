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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!token || !userId) {
      navigate("/login");
    } else {
      fetchWishlist(currentPage);
    }
    // eslint-disable-next-line
  }, [currentPage]);

  const fetchWishlist = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/wishlist/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit: itemsPerPage },
      });
      setWishlistItems(response.data.wishlist);
      setTotalItems(response.data.total);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await api.post(
        `/api/wishlist/remove`,
        { userId, productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchWishlist(currentPage);
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };

  const handleAddToCartAndRemoveFromWishlist = async (productId) => {
    try {
      await api.post(
        `/api/cart/add`,
        { userId, productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await handleRemoveFromWishlist(productId);
      alert("Item moved to cart!");
    } catch (err) {
      console.error("Error adding to cart and removing from wishlist:", err);
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (loading) return <div className="wishlist-loading-spinner"></div>;

  return (
    <div className="wishlist-container">
      <h2 className="wishlist-header">Your Wishlist</h2>
      <button className="wishlist-go-back-button" onClick={() => navigate(-1)}>
        Go Back
      </button>
      {wishlistItems.length > 0 ? (
        <>
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

          {/* Pagination Controls */}
          <div className="wishlist-pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="wishlist-pagination-button"
            >
              Previous
            </button>
            <span className="wishlist-pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="wishlist-pagination-button"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="wishlist-empty-message">No items in wishlist.</p>
      )}
    </div>
  );
};

export default Wishlist;

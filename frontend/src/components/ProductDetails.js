import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styling/productdetails.css";

const api = axios.create({
  baseURL: "https://e-commerce-dh0b.onrender.com",
});

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [inCart, setInCart] = useState(false);
  const navigate = useNavigate();

  const getUserId = () => {
    const userId = localStorage.getItem("userId");
    return userId;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/api/products/product/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setLoading(false);
      }
    };

    const checkIfInWishlist = async () => {
      try {
        const userId = getUserId();
        if (userId) {
          const response = await api.get(`/api/wishlist/check/${userId}/${id}`);
          setInWishlist(response.data.isInWishlist);
        }
      } catch (err) {
        console.error("Error checking wishlist:", err);
      }
    };

    const checkIfInCart = async () => {
      try {
        const userId = getUserId();
        if (userId) {
          const response = await api.get(`/api/cart/check/${userId}/${id}`);
          setInCart(response.data.isInCart);
        }
      } catch (err) {
        console.error("Error checking cart:", err);
      }
    };

    fetchProduct();
    checkIfInWishlist();
    checkIfInCart();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleAddToWishlist = async () => {
    try {
      const userId = getUserId();
      if (userId) {
        if (!inWishlist) {
          await api.post(`/api/wishlist/add`, { userId, productId: id });
          setInWishlist(true);
          alert("Added to Wishlist");
        } else {
          alert("Item is already in Wishlist");
        }
      } else {
        console.log("User not logged in");
      }
    } catch (err) {
      console.error("Error adding to wishlist:", err);
    }
  };

  const handleRemoveFromWishlist = async () => {
    try {
      const userId = getUserId();
      if (userId) {
        await api.post(`/api/wishlist/remove`, { userId, productId: id });
        setInWishlist(false);
        alert("Removed from Wishlist");
      } else {
        console.log("User not logged in");
      }
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };

  const handleAddToCart = async () => {
    try {
      const userId = getUserId();
      if (userId) {
        if (!inCart) {
          await api.post(`/api/cart/add`, { userId, productId: id });
          setInCart(true);
          alert("Added to Cart");
        } else {
          alert("Item is already in Cart");
        }
      } else {
        console.log("User not logged in");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const handleRemoveFromCart = async () => {
    try {
      const userId = getUserId();
      if (userId) {
        await api.post(`/api/cart/remove`, { userId, productId: id });
        setInCart(false);
        alert("Removed from Cart");
      } else {
        console.log("User not logged in");
      }
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  if (loading) return <div className="loading-spinner"></div>;

  if (!product) return <div>No product found</div>;

  return (
    <div className="product-details-section">
      <h1>{product.name}</h1>
      <div className="product-details-container">
        <img
          src={product.img}
          alt={product.name}
          className="product-details-img"
        />
        <div className="product-details-info">
          <p className="des">
            <strong>Price:</strong> {product.cost}
          </p>
          <p className="des">
            <strong>Description:</strong> {product.description}
          </p>
        </div>
      </div>
      <div className="product-action-buttons">
        {inWishlist ? (
          <button
            className="button wishlist-button"
            onClick={handleRemoveFromWishlist}
          >
            <i className="fa fa-heart button-icon" aria-hidden="true"></i>
            Remove from Wishlist
          </button>
        ) : (
          <button
            className="button wishlist-button"
            onClick={handleAddToWishlist}
          >
            <i className="fa fa-heart button-icon" aria-hidden="true"></i>
            Add to Wishlist
          </button>
        )}
        {inCart ? (
          <button className="button cart-button" onClick={handleRemoveFromCart}>
            <i
              className="fa fa-shopping-cart button-icon"
              aria-hidden="true"
            ></i>
            Remove from Cart
          </button>
        ) : (
          <button className="button cart-button" onClick={handleAddToCart}>
            <i
              className="fa fa-shopping-cart button-icon"
              aria-hidden="true"
            ></i>
            Add to Cart
          </button>
        )}
      </div>
      <div className="go-back-container">
        <button className="button go-back-button" onClick={handleGoBack}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styling/womenpage.css";

const api = axios.create({
  baseURL: "https://e-commerce-dh0b.onrender.com",
});

const Womenpage = () => {
  const [products, setProducts] = useState([]);
  const category = "women";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(`api/products/category/${category}`);
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, [category]);

  const handleProductClick = (productId) => {
    navigate(`/homepage/womens-wear/product/${productId}`);
  };

  return (
    <div className="womenpage-container">
      <h2 className="womenpage-header">Women's Wear</h2>
      <div className="womenpage-product-cards-container">
        {products.map((product) => (
          <div
            key={product._id}
            className="womenpage-product-card"
            onClick={() => handleProductClick(product._id)}
          >
            <img
              src={product.img}
              alt={product.name}
              className="womenpage-product-card-img"
            />
            <div className="womenpage-product-card-name">{product.name}</div>
            <div className="womenpage-product-card-cost">{product.cost}</div>
          </div>
        ))}
      </div>
      <div className="womenpage-go-back-container">
        <button
          className="womenpage-go-back-button"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Womenpage;

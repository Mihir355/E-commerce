import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styling/kidspage.css";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

const Kidspage = () => {
  const [products, setProducts] = useState([]);
  const category = "kids";
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
    navigate(`/homepage/kids-wear/product/${productId}`);
  };

  return (
    <div className="kidspage-container">
      <h2 className="kidspage-header">Kids' Wear</h2>
      <div className="kidspage-product-cards-container">
        {products.map((product) => (
          <div
            key={product._id}
            className="kidspage-product-card"
            onClick={() => handleProductClick(product._id)}
          >
            <img
              src={product.img}
              alt={product.name}
              className="kidspage-product-card-img"
            />
            <div className="kidspage-product-card-name">{product.name}</div>
            <div className="kidspage-product-card-cost">{product.cost}</div>
          </div>
        ))}
      </div>
      <div className="kidspage-go-back-container">
        <button
          className="kidspage-go-back-button"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Kidspage;

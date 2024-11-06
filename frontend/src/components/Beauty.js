import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styling/beauty.css";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

const Beauty = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const subcategory = "Beauty";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(`api/products/${subcategory}`);
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, [subcategory]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="beauty-section">
      <h2 className="beauty-header">Beauty Products</h2>
      <div className="beauty-product-cards-container">
        {products.map((product) => (
          <div
            key={product._id}
            className="beauty-product-card"
            onClick={() => navigate(`/homepage/beauty/product/${product._id}`)}
          >
            <img
              src={product.img}
              alt={product.name}
              className="beauty-product-card-img"
            />
            <div className="beauty-product-card-name">{product.name}</div>
            <div className="beauty-product-card-cost">{product.cost}</div>
          </div>
        ))}
      </div>
      <div className="beauty-go-back-container">
        <button className="beauty-go-back-button" onClick={handleGoBack}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Beauty;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styling/decor.css";

const api = axios.create({
  baseURL: "https://e-commerce-dh0b.onrender.com",
});

const Decor = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const subcategory = "Decor";

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
    <div className="decor-section">
      <h2 className="decor-header">Decor</h2>
      <div className="decor-product-cards-container">
        {products.map((product) => (
          <div
            key={product._id}
            className="decor-product-card"
            onClick={() => navigate(`/homepage/decor/product/${product._id}`)}
          >
            <img
              src={product.img}
              alt={product.name}
              className="decor-product-card-img"
            />
            <div className="decor-product-card-name">{product.name}</div>
            <div className="decor-product-card-cost">{product.cost}</div>
          </div>
        ))}
      </div>
      <div className="decor-go-back-container">
        <button className="decor-go-back-button" onClick={handleGoBack}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Decor;

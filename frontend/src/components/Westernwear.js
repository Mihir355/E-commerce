import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styling/westernwear.css";

const api = axios.create({
  baseURL: "https://e-commerce-dh0b.onrender.com",
});

const Westernwear = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const subcategory = "Western";

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
    <div className="westernwear-section">
      <h2 className="westernwear-header">Western Wear</h2>
      <div className="westernwear-product-cards-container">
        {products.map((product) => (
          <div
            key={product._id}
            className="westernwear-product-card"
            onClick={() =>
              navigate(`/homepage/western-wear/product/${product._id}`)
            }
          >
            <img
              src={product.img}
              alt={product.name}
              className="westernwear-product-card-img"
            />
            <div className="westernwear-product-card-name">{product.name}</div>
            <div className="westernwear-product-card-cost">{product.cost}</div>
          </div>
        ))}
      </div>
      <div className="westernwear-go-back-container">
        <button className="westernwear-go-back-button" onClick={handleGoBack}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Westernwear;

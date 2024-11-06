import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styling/menswear.css";

const api = axios.create({
  baseURL: "https://e-commerce-dh0b.onrender.com",
});

const Menswear = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const subcategory = "Men";

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
    <div className="menswear-section">
      <h2 className="menswear-header">Men's Wear</h2>
      <div className="menswear-product-cards-container">
        {products.map((product) => (
          <div
            key={product._id}
            className="menswear-product-card"
            onClick={() =>
              navigate(`/homepage/mens-wear/product/${product._id}`)
            }
          >
            <img
              src={product.img}
              alt={product.name}
              className="menswear-product-card-img"
            />
            <div className="menswear-product-card-name">{product.name}</div>
            <div className="menswear-product-card-cost">{product.cost}</div>
          </div>
        ))}
      </div>
      <div className="menswear-go-back-container">
        <button className="menswear-go-back-button" onClick={handleGoBack}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Menswear;

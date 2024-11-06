import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styling/activewear.css";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

const Activewear = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const subcategory = "Active";

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
    <div className="activewear-section">
      <h2 className="activewear-header">Active Wear</h2>
      <div className="activewear-product-cards-container">
        {products.map((product) => (
          <div
            key={product._id}
            className="activewear-product-card"
            onClick={() =>
              navigate(`/homepage/active-wear/product/${product._id}`)
            }
          >
            <img
              src={product.img}
              alt={product.name}
              className="activewear-product-card-img"
            />
            <div className="activewear-product-card-name">{product.name}</div>
            <div className="activewear-product-card-cost">{product.cost}</div>
          </div>
        ))}
      </div>
      <div className="activewear-go-back-container">
        <button className="activewear-go-back-button" onClick={handleGoBack}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Activewear;

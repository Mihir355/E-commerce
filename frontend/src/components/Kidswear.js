import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styling/kidswear.css";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

const Kidswear = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const subcategory = "Kids";

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
    <div className="kidswear-section">
      <h2 className="kidswear-header">Kids Wear</h2>
      <div className="kidswear-product-cards-container">
        {products.map((product) => (
          <div
            key={product._id}
            className="kidswear-product-card"
            onClick={() =>
              navigate(`/homepage/kids-wear/product/${product._id}`)
            }
          >
            <img
              src={product.img}
              alt={product.name}
              className="kidswear-product-card-img"
            />
            <div className="kidswear-product-card-name">{product.name}</div>
            <div className="kidswear-product-card-cost">{product.cost}</div>
          </div>
        ))}
      </div>
      <div className="kidswear-go-back-container">
        <button className="kidswear-go-back-button" onClick={handleGoBack}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Kidswear;

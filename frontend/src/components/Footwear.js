import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styling/footwear.css";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

const Footwear = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const subcategory = "Footwear";

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
    <div className="footwear-section">
      <h2 className="footwear-header">Footwear</h2>
      <div className="footwear-product-cards-container">
        {products.map((product) => (
          <div
            key={product._id}
            className="footwear-product-card"
            onClick={() =>
              navigate(`/homepage/footwear/product/${product._id}`)
            }
          >
            <img
              src={product.img}
              alt={product.name}
              className="footwear-product-card-img"
            />
            <div className="footwear-product-card-name">{product.name}</div>
            <div className="footwear-product-card-cost">{product.cost}</div>
          </div>
        ))}
      </div>
      <div className="footwear-go-back-container">
        <button className="footwear-go-back-button" onClick={handleGoBack}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Footwear;

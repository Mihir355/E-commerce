import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styling/accessories.css";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

const Accessories = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const subcategory = "Accessories";

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
    <div className="accessories-section">
      <h2 className="accessories-header">Accessories</h2>
      <div className="accessories-product-cards-container">
        {products.map((product) => (
          <div
            key={product._id}
            className="accessories-product-card"
            onClick={() =>
              navigate(`/homepage/accessories/product/${product._id}`)
            }
          >
            <img
              src={product.img}
              alt={product.name}
              className="accessories-product-card-img"
            />
            <div className="accessories-product-card-name">{product.name}</div>
            <div className="accessories-product-card-cost">{product.cost}</div>
          </div>
        ))}
      </div>
      <div className="accessories-go-back-container">
        <button className="accessories-go-back-button" onClick={handleGoBack}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Accessories;

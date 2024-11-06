import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styling/menpage.css";

const api = axios.create({
  baseURL: "https://e-commerce-dh0b.onrender.com",
});

const Menpage = () => {
  const [products, setProducts] = useState([]);
  const category = "Men";
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

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleProductClick = (productId) => {
    navigate(`/homepage/mens-wear/product/${productId}`);
  };

  return (
    <div className="menpage-container">
      <h2 className="menpage-header">Men's Category</h2>
      <div className="menpage-product-cards-container">
        {products.map((product) => (
          <div
            key={product._id}
            className="menpage-product-card"
            onClick={() => handleProductClick(product._id)}
          >
            <img
              src={product.img}
              alt={product.name}
              className="menpage-product-card-img"
            />
            <div className="menpage-product-card-name">{product.name}</div>
            <div className="menpage-product-card-cost">{product.cost}</div>
          </div>
        ))}
      </div>
      <div className="menpage-go-back-container">
        <button className="menpage-go-back-button" onClick={handleGoBack}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Menpage;

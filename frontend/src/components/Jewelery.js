import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styling/jewelery.css";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

const Jewelery = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const subcategory = "Jewelry";

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
    <div className="jewelery-section">
      <h2 className="jewelery-header">Jewelry</h2>
      <div className="jewelery-product-cards-container">
        {products.map((product) => (
          <div
            key={product._id}
            className="jewelery-product-card"
            onClick={() =>
              navigate(`/homepage/jewelery/product/${product._id}`)
            }
          >
            <img
              src={product.img}
              alt={product.name}
              className="jewelery-product-card-img"
            />
            <div className="jewelery-product-card-name">{product.name}</div>
            <div className="jewelery-product-card-cost">{product.cost}</div>
          </div>
        ))}
      </div>
      <div className="jewelery-go-back-container">
        <button className="jewelery-go-back-button" onClick={handleGoBack}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Jewelery;

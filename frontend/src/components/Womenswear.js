import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styling/womenswear.css";

const api = axios.create({
  baseURL: "https://e-commerce-dh0b.onrender.com",
});

const Womenswear = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const subcategory = "Women";

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
    <div className="womenswear-section">
      <h2 className="womenswear-header">Women's Wear</h2>
      <div className="womenswear-product-cards-container">
        {products.map((product) => (
          <div
            key={product._id}
            className="womenswear-product-card"
            onClick={() =>
              navigate(`/homepage/womens-wear/product/${product._id}`)
            }
          >
            <img
              src={product.img}
              alt={product.name}
              className="womenswear-product-card-img"
            />
            <div className="womenswear-product-card-name">{product.name}</div>
            <div className="womenswear-product-card-cost">{product.cost}</div>
          </div>
        ))}
      </div>
      <div className="womenswear-go-back-container">
        <button className="womenswear-go-back-button" onClick={handleGoBack}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Womenswear;

import React from "react";
import { useNavigate } from "react-router-dom";
import "../styling/categoryCards.css";

const CategoryCards = () => {
  const navigate = useNavigate();

  const categories = [
    {
      name: "Men's Wear",
      img: "https://res.cloudinary.com/dkpm0glt6/image/upload/v1723888211/men-wear_h0ptmx.jpg",
      route: "mens-wear",
    },
    {
      name: "Active Wear",
      img: "https://res.cloudinary.com/dkpm0glt6/image/upload/v1730881742/active-wear_aohwyh.jpg",
      route: "active-wear",
    },
    {
      name: "Western Wear",
      img: "https://res.cloudinary.com/dkpm0glt6/image/upload/v1723888240/western-wear_zca64b.jpg",
      route: "western-wear",
    },
    {
      name: "Women's Wear",
      img: "https://res.cloudinary.com/dkpm0glt6/image/upload/v1723888241/women-wear_c4vjbc.jpg",
      route: "womens-wear",
    },
    {
      name: "Kids' Wear",
      img: "https://res.cloudinary.com/dkpm0glt6/image/upload/v1723888210/kids-wear_d5qrpv.jpg",
      route: "kids-wear",
    },
    {
      name: "Accessories",
      img: "https://res.cloudinary.com/dkpm0glt6/image/upload/v1730881743/accessories_c2x99d.jpg",
      route: "accessories",
    },
    {
      name: "Footwear",
      img: "https://res.cloudinary.com/dkpm0glt6/image/upload/v1730881742/footwear_oa9yvu.jpg",
      route: "footwear",
    },
    {
      name: "Jewelery",
      img: "https://res.cloudinary.com/dkpm0glt6/image/upload/v1730881743/jwelery_g6dt2u.jpg",
      route: "jewelery",
    },
    {
      name: "Beauty Products",
      img: "https://res.cloudinary.com/dkpm0glt6/image/upload/v1730881743/beauty_luf5vr.jpg",
      route: "beauty-products",
    },
    {
      name: "Home Decor",
      img: "https://res.cloudinary.com/dkpm0glt6/image/upload/v1723888207/home-decor_wcw3n4.jpg",
      route: "home-decor",
    },
  ];

  return (
    <div className="category-section">
      <h2 className="category-heading">Shop by Category</h2>
      <div className="category-cards-container">
        {categories.map((category, index) => (
          <div
            key={index}
            className="category-card"
            onClick={() => navigate(`/homepage/${category.route}`)}
          >
            <img
              src={category.img}
              alt={category.name}
              className="category-card-img"
            />
            <div className="category-card-name">{category.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCards;

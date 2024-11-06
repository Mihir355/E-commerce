import React from "react";
import { useNavigate } from "react-router-dom";
import "../styling/nav.css";
import { FaUser, FaHeart, FaShoppingBag, FaSignOutAlt } from "react-icons/fa";

const Nav = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/homepage");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleWishlistClick = () => {
    navigate("/wishlist");
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div
        className="logo"
        onClick={handleLogoClick}
        style={{ cursor: "pointer" }}
      >
        <img
          src="https://res.cloudinary.com/dkpm0glt6/image/upload/v1730881743/logo_pg6orv.jpg"
          alt="Logo"
        />
      </div>
      <div className="options">
        <span onClick={() => navigate("/category/men")}>Men</span>
        <span onClick={() => navigate("/category/women")}>Women</span>
        <span onClick={() => navigate("/category/kids")}>Kids</span>
      </div>
      <div className="icons">
        <FaUser onClick={handleProfileClick} style={{ cursor: "pointer" }} />
        <FaHeart onClick={handleWishlistClick} style={{ cursor: "pointer" }} />
        <FaShoppingBag
          onClick={handleCartClick}
          style={{ cursor: "pointer" }}
        />
        <FaSignOutAlt onClick={handleLogout} style={{ cursor: "pointer" }} />
      </div>
    </nav>
  );
};

export default Nav;

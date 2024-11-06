import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./Nav";
import CategoryCards from "./CategoryCards";
import Menswear from "./Menswear";
import Activewear from "./Activewear";
import Westernwear from "./Westernwear";
import Womenswear from "./Womenswear";
import Kidswear from "./Kidswear";
import Accessories from "./Accessories";
import Footwear from "./Footwear";
import Jewelery from "./Jewelery";
import Decor from "./Decor";
import Beauty from "./Beauty";
import ProductDetails from "./ProductDetails";

const Homepage = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <CategoryCards />
            </>
          }
        />
        <Route path="mens-wear" element={<Menswear />} />
        <Route path="active-wear" element={<Activewear />} />
        <Route path="western-wear" element={<Westernwear />} />
        <Route path="womens-wear" element={<Womenswear />} />
        <Route path="kids-wear" element={<Kidswear />} />
        <Route path="accessories" element={<Accessories />} />
        <Route path="footwear" element={<Footwear />} />
        <Route path="jewelery" element={<Jewelery />} />
        <Route path="home-decor" element={<Decor />} />
        <Route path="beauty-products" element={<Beauty />} />

        {/* Nested Route for ProductDetails */}
        <Route path=":category/product/:id" element={<ProductDetails />} />
      </Routes>
    </div>
  );
};

export default Homepage;

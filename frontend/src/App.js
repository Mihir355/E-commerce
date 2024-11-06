import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Homepage from "./components/Homepage";
import Profile from "./components/Profile";
import Wishlist from "./components/Wishlist";
import Cart from "./components/Cart";
import MenPage from "./components/Menpage";
import WomenPage from "./components/Womenpage";
import KidsPage from "./components/Kidspage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/homepage/*" element={<Homepage />} />
        <Route path="category/men" element={<MenPage />} />
        <Route path="category/women" element={<WomenPage />} />
        <Route path="category/kids" element={<KidsPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default App;

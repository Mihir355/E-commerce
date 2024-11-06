import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styling/login.css";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://localhost:5000",
  });

  const handleLogin = async () => {
    try {
      const response = await api.post("/api/user/login", { phoneNumber });

      const result = response.data;
      if (result.success) {
        localStorage.setItem("userId", result.userId);
        localStorage.setItem("phoneNumber", phoneNumber);

        if (response.status === 201) {
          alert("Registered successfully!");
        } else if (response.status === 200) {
          alert("Login successful!");
        }

        navigate("/homepage");
      } else {
        console.error("Failed to login");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error logging in. Please try again.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-left-side">
          <img
            src="https://res.cloudinary.com/dkpm0glt6/image/upload/v1730881744/Welcome_bxxxmv.jpg"
            alt="Welcome"
            className="login-image"
          />
        </div>
        <div className="login-right-side">
          <h2 className="login-header">Login to Excitement</h2>
          <input
            type="text"
            placeholder="Phone Number"
            className="login-input-box"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <button onClick={handleLogin} className="login-button">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

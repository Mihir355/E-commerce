// Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styling/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "https://e-commerce-dh0b.onrender.com",
  });

  const handleLogin = async () => {
    try {
      const res = await api.post("/api/user/login", { email });
      setShowOtpInput(true);
      setMessage("OTP sent to your email.");
    } catch (err) {
      console.error(err);
      setMessage("Error sending OTP. Try again.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await api.post("/api/user/verify-otp", { email, otp });
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        setMessage("Verified successfully!");
        navigate("/homepage");
      } else {
        setMessage("Invalid OTP. Try again.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Verification failed.");
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
          {!showOtpInput ? (
            <>
              <input
                type="email"
                placeholder="Email"
                className="login-input-box"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button onClick={handleLogin} className="login-button">
                Send OTP
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                className="login-input-box"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button onClick={handleVerifyOtp} className="login-button">
                Verify OTP
              </button>
            </>
          )}
          {message && <div className="custom-warning-box">{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default Login;

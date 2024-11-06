import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styling/profile.css";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

const Profile = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedPhoneNumber = localStorage.getItem("phoneNumber");
    if (storedPhoneNumber) {
      setPhoneNumber(storedPhoneNumber);
      const storedName = localStorage.getItem(`${storedPhoneNumber}_name`);
      const storedGender = localStorage.getItem(`${storedPhoneNumber}_gender`);
      const storedAge = localStorage.getItem(`${storedPhoneNumber}_age`);

      if (storedName) setName(storedName);
      if (storedGender) setGender(storedGender);
      if (storedAge) setAge(storedAge);
    }

    const fetchOrders = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response = await api.get(`/api/orders/${userId}`);
          setOrders(response.data);
        } catch (err) {
          console.error("Error fetching orders:", err);
        }
      }
    };

    fetchOrders();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put("/api/user/update", {
        phoneNumber,
        name,
        gender,
        age,
      });

      if (response.data.success) {
        localStorage.setItem(`${phoneNumber}_name`, name);
        localStorage.setItem(`${phoneNumber}_gender`, gender);
        localStorage.setItem(`${phoneNumber}_age`, age);

        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating profile: " + error.message);
    }
  };

  const handleGoBack = () => {
    navigate("/homepage");
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Update Profile</h2>
      <form onSubmit={handleUpdate} className="profile-form">
        <div className="formGroup">
          <label className="profile-label">Phone Number:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            className="profile-input"
            disabled
          />
        </div>
        <div className="formGroup">
          <label className="profile-label">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="profile-input"
            placeholder={name ? name : "Enter your name"}
          />
        </div>
        <div className="formGroup">
          <label className="profile-label">Gender:</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            className="profile-select"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="formGroup">
          <label className="profile-label">Age:</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            className="profile-input"
            placeholder={age ? age : "Enter your age"}
          />
        </div>
        <div className="buttons">
          <button type="submit" className="profile-button">
            Update
          </button>
          <button
            type="button"
            onClick={handleGoBack}
            className="profile-button"
          >
            Go Back
          </button>
        </div>
      </form>

      <div className="orders-section">
        <h3 className="orders-title">Your Orders</h3>
        {orders.length > 0 ? (
          <ul className="orders-list">
            {orders.map((order, index) => (
              <li key={order._id} className="order-item">
                <h4 className="order-title">Order {index + 1}</h4>
                <div className="products-container">
                  {order.products.map((product) => (
                    <div key={product._id} className="product-item">
                      <img
                        src={product.img}
                        alt={product.name}
                        className="product-image"
                      />
                      <p className="product-description">{product.name}</p>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-orders-message">
            You have not placed any orders yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;

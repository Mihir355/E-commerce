import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styling/profile.css";

const api = axios.create({
  baseURL: "https://e-commerce-dh0b.onrender.com",
});

const ORDERS_PER_PAGE = 5;

const Profile = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      const fetchUserDetails = async () => {
        try {
          const response = await api.get(`/api/user/details/${storedUserId}`);
          if (response.data.success) {
            const { name, gender, age, email } = response.data.user;
            setName(name || "");
            setGender(gender || "");
            setAge(age || "");
            setEmail(email || "");
          } else {
            console.error("User not found");
          }
        } catch (err) {
          console.error("Error fetching user details:", err);
        }
      };

      const fetchOrders = async () => {
        try {
          const response = await api.get(`/api/orders/user/${storedUserId}`);
          setOrders(response.data || []);
        } catch (err) {
          console.error("Error fetching orders:", err);
        }
      };

      fetchUserDetails();
      fetchOrders();
    }
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put("/api/user/update", {
        email,
        name,
        gender,
        age,
      });

      if (response.data.success) {
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

  // Pagination logic
  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
  const currentOrders = orders.slice(startIndex, startIndex + ORDERS_PER_PAGE);

  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) => {
      const nextPage = direction === "next" ? prevPage + 1 : prevPage - 1;
      return Math.min(Math.max(nextPage, 1), totalPages);
    });
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Update Profile</h2>
      <form onSubmit={handleUpdate} className="profile-form">
        <div className="formGroup">
          <label className="profile-label">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="profile-input"
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
            placeholder="Enter your name"
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
            placeholder="Enter your age"
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
        {currentOrders.length > 0 ? (
          <>
            <ul className="orders-list">
              {currentOrders.map((order, index) => (
                <li key={order._id} className="order-item">
                  <h4 className="order-title">
                    Order {(currentPage - 1) * ORDERS_PER_PAGE + index + 1}
                  </h4>
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

            <div
              className="pagination-buttons"
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
                gap: "10px",
              }}
            >
              <button
                className="profile-button"
                onClick={() => handlePageChange("prev")}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span style={{ alignSelf: "center", color: "#333" }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="profile-button"
                onClick={() => handlePageChange("next")}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
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

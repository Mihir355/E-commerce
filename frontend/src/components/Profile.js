import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styling/profile.css";

const api = axios.create({
  baseURL: "https://e-commerce-dh0b.onrender.com",
});

const Profile = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const limit = 5;

  const token = localStorage.getItem("token");

  const handleUnauthorized = () => {
    alert("Unauthorized access. Please log in.");
    navigate("/");
  };

  const fetchOrders = async (userId, currentPage = 1) => {
    try {
      const response = await api.get(
        `/api/orders/user/${userId}?page=${currentPage}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleUnauthorized();
      } else {
        console.error("Error fetching orders:", err);
      }
    }
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    if (!storedUserId || !token) {
      handleUnauthorized();
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await api.get(`/api/user/details/${storedUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
        if (err.response?.status === 401 || err.response?.status === 403) {
          handleUnauthorized();
        } else {
          console.error("Error fetching user details:", err);
        }
      }
    };

    fetchUserDetails();
    fetchOrders(storedUserId, page);
  }, [page, token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId || !token) {
      alert("User not logged in");
      navigate("/");
      return;
    }

    try {
      const response = await api.put(
        "/api/user/update",
        {
          email,
          name,
          gender,
          age,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile: " + response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleUnauthorized();
      } else {
        console.error("Error updating user:", error);
        alert("Error updating profile: " + error.message);
      }
    }
  };

  const handleGoBack = () => {
    navigate("/homepage");
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Update Profile</h2>
      <form onSubmit={handleUpdate} className="profile-form">
        {/* user details */}
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
        {orders.length > 0 ? (
          <>
            <ul className="orders-list">
              {orders.map((order, index) => (
                <li key={order._id} className="order-item">
                  <h4 className="order-title">
                    Order {(page - 1) * limit + index + 1}
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
            <div className="pagination">
              <button
                className="page-button"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                Prev
              </button>
              <span className="page-info">
                Page {page} of {totalPages}
              </span>
              <button
                className="page-button"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
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

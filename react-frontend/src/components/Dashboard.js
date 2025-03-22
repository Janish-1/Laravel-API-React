import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [User, SetUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const BACKEND_URL = "http://localhost:8000/api";
    const token = localStorage.getItem("token");
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        SetUser(response.data);
      } catch (err) {
        console.error("Error Fetching User Data", err);
      }
    };
    fetchUserData();
  }, []);

  if (!User) {
    return <p>Loading user data...</p>;
  }

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    const BACKEND_URL = "http://localhost:8000/api";
  
    try {
      // Make sure the token is included in the headers
      await axios.post(`${BACKEND_URL}/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Clear the token from local storage
      localStorage.removeItem("token");
  
      // Redirect to login page
      navigate("/login");
    } catch (err) {
      console.error("Error logging out", err);
    }
  };

  return (
    <div>
      <h2>Welcome, {User.name}</h2>
      <p>Email: {User.email}</p>
      <p>
        Account created at: {new Date(User.created_at).toLocaleDateString()}
      </p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;

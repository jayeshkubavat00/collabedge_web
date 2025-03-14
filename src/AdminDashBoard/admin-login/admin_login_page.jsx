import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./admin_login_style.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🔹 Check if admin is already logged in
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigate("/admin-dashboard"); // Redirect if logged in
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/admin/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user ID in localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userID');
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminId", data.user.id);

        navigate("/admin-dashboard"); 
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (error) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="admin-login-container">
      <form className="admin-login-form" onSubmit={handleLogin}>
        <h2>Admin Login</h2>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error-msg">{error}</p>}
        <button type="submit" className="button">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;

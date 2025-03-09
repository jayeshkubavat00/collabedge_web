import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./AuthForm.css";

const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // If token exists, redirect user to the main page
    const token = localStorage.getItem('token');
    if (token) {
      navigate("/main");
    }
  }, [navigate]);

  // Form Validation Logic
  const validateForm = () => {
    if (!email || !password) {
      return "Email and Password are required!";
    }
    if (isSignup && (!fullName || !confirmPassword)) {
      return "Full Name and Confirm Password are required!";
    }
    if (isSignup && password !== confirmPassword) {
      return "Passwords do not match!";
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return "Email is invalid!";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long!";
    }
    return null;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setSuccess('');

    try {
      if (isSignup) {
        // Signup API Call
        const response = await axios.post('http://localhost:5000/api/auth/register', {
          fullName,
          email,
          password,
        });

        if (response.data.status) {
          setSuccess(response.data.message);
          setIsSignup(false); // Switch to login form after signup
        } else {
          setError(response.data.message || "Something went wrong!");
        }
      } else {
        // Login API Call
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email,
          password,
        });

        if (response.data.status) {
          setSuccess(response.data.message);

          // Store JWT token in localStorage
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userID', response.data.userID); // Store userID

          // Redirect to main page after login
          navigate("/main");
        } else {
          setError(response.data.message || "Invalid credentials");
        }
      }
    } catch (err) {
      setError('Failed to connect to the server!');
    }
  };

  return (
    <div className="wrapper">
      <div className="title-text">
        <div className={`title ${isSignup ? "signup" : "login"}`}>
          {isSignup ? "Signup" : "Login"}
        </div>
      </div>

      <div className="form-container">
        <div className="slide-controls">
          <input
            type="radio"
            name="slide"
            id="login"
            checked={!isSignup}
            onChange={() => setIsSignup(false)}
          />
          <input
            type="radio"
            name="slide"
            id="signup"
            checked={isSignup}
            onChange={() => setIsSignup(true)}
          />
          <label htmlFor="login" className="slide login">
            Login
          </label>
          <label htmlFor="signup" className="slide signup">
            Signup
          </label>
          <div className="slider-tab"></div>
        </div>

        <div className="form-inner">
          {/* Form submission with validation */}
          <form onSubmit={handleSubmit}>
            {isSignup && (
              <div className="field">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            )}
            <div className="field">
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="field">
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {isSignup && (
              <div className="field">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}
            {/* Display errors or success message */}
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            <div className="field btn">
              <input type="submit" value={isSignup ? "Signup" : "Login"} />
            </div>
            <div className="signup-link">
              {isSignup ? (
                <>
                  Already have an account?{" "}
                  <a href="#" onClick={() => setIsSignup(false)}>
                    Login now
                  </a>
                </>
              ) : (
                <>
                  Not a member?{" "}
                  <a href="#" onClick={() => setIsSignup(true)}>
                    Signup now
                  </a>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

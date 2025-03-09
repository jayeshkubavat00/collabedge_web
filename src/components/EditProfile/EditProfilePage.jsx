import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EditProfile.css"; // Your existing CSS

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    skyId: "",
    email: "",
    phone: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Authorization token is missing.");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const user = response.data.user;
          setFormData({
            name: user.fullName || "",
            skyId: user.skyId || "",
            email: user.email || "",
            phone: user.phoneNumber || "",
            bio: user.bio || "",
          });
        } else {
          alert(`Error: ${response.data.message || "Failed to fetch profile"}`);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        alert("Failed to fetch profile data.");
      }
    };

    fetchProfileData();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit (update profile)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading spinner
    setError(null); // Reset any previous error message

    const token = localStorage.getItem("token");
    const userID = localStorage.getItem("userID"); // Fetch userID from localStorage

    if (!userID) {
      setError("UserID is missing.");
      setLoading(false);
      return;
    }

    try {
      // Add userID to the formData
      const updatedData = { ...formData, userID };

      // Send a PUT request to update the profile data
      const response = await axios.put(
        "http://localhost:5000/api/auth/edit-profile", // URL for updating profile
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Profile updated successfully!");
        // Optionally re-fetch the profile data after successful save
        fetchProfileData(); // This will refresh the profile data after updating
      } else {
        setError("Error saving profile data.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile.");
    }

    setLoading(false); // Hide loading spinner
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="input-group">
          <label htmlFor="name" className="section-title">Full Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
          />

          <label htmlFor="skyId" className="section-title">SkyID</label>
          <input
            type="text"
            name="skyId"
            id="skyId"
            placeholder="Enter your SkyID"
            value={formData.skyId}
            onChange={handleChange}
            className="input-field"
          />

          <label htmlFor="bio" className="section-title">Bio</label>
          <input
            type="text"
            name="bio"
            id="bio"
            placeholder="Enter your bio"
            value={formData.bio}
            onChange={handleChange}
            className="input-field"
          />

          <label htmlFor="email" className="section-title">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            readOnly='true'
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
          />

          <label htmlFor="phone" className="section-title">Phone Number</label>
          <input
            type="tel"
            name="phone"
            id="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        {loading ? (
          <button className="save-button" disabled>Saving...</button>
        ) : (
          <button type="submit" className="save-button">
            Save Changes
          </button>
        )}

        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default EditProfile;

import React, { useState } from 'react';
import axios from 'axios';
import './create_admin_style.css';

const CreateAdmin = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false); // To handle loading state
  const [error, setError] = useState(null); // To handle errors
  const [successMessage, setSuccessMessage] = useState(null); // To handle success message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset error before new submission
    setSuccessMessage(null); // Reset success message before new submission

    try {
      // Replace 'YOUR_API_URL' with the actual API URL for your backend
      const response = await axios.post('http://localhost:5000/api/admin/create-admin', formData);

      // On successful admin creation
      setSuccessMessage('Admin created successfully!');
      setFormData({ fullName: '', email: '', password: '', phone: '' }); // Reset form data
      console.log('Admin Created:', response.data);
    } catch (error) {
      // Handle error from the API
      setError('Error creating admin. Please try again.');
      console.error('API Error:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-admin-container">
      <h2>Create Admin</h2>

      {/* Display success or error message */}
      {successMessage && <p className="success-message">{successMessage}</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="admin-login-form">
        <label htmlFor="fullName">Full Name</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter Full Name"
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter Email"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter Password"
          required
        />

        <label htmlFor="phone">Phone</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter Phone Number"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Creating Admin...' : 'Create Admin'}
        </button>
      </form>
    </div>
  );
};

export default CreateAdmin;

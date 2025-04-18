import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./dashboard_style.css";

const AdminDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isDeleteUser, setIsDeleteUser] = useState(false);
  const [isDeleteUserID, setDeleteUserID] = useState(''); // Renamed this to isDeleteUserID for clarity
  const [feedData, setFeedData] = useState([]);
  const navigate = useNavigate();

  // Handle delete user action
  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        console.error("No admin token found");
        navigate("/admin-login");
        return;
      }

      // Call the API to delete the user and their associated data (feeds, interests)
      const response = await axios.delete(`http://localhost:5000/api/admin/delete-user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status) {
        setFeedData(feedData.filter((user) => user._id !== userId)); // Remove deleted user from state
        alert("User deleted successfully!");
        setIsDeleteUser(false);
        fetchUsers(); // Refresh the list after deletion
      } else {
        console.error("Error deleting user:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error.response ? error.response.data : error.message);
    }
  };

  // Fetch user data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          console.error("No admin token found");
          navigate("/admin-login");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/admin/user-list", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.status && Array.isArray(response.data.data)) {
          setFeedData(response.data.data);
        } else {
          console.error("Invalid API Response Format");
        }
      } catch (error) {
        console.error("Error fetching user list:", error.response ? error.response.data : error.message);
      }
    };

    fetchUsers();
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminId");
    navigate("/admin-login");
  };

  // Handle Delete User dialog action
  const handleDeleteUserDialog = () => {
    handleDeleteUser(isDeleteUserID); // Delete user with the stored ID
  };

  return (
    <div className="main-container">
      <div className="logo">
        <img
          src="https://media-hosting.imagekit.io//5983c9ce2a6147f7/CollabEdge_logo-removebg-preview.png?Expires=1836148601&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=LulfTHGF7o09faRvwlqBm4nMGiGo7t7wfIDdNWHkm0X3FF6W2h9ug6pz7JRaqTz1VFs2ctuLjesWLC06IjmYcVhELPi9df68e7NYynHWT8SF2ktPPiomyEutJUr8FeHNoxzkYOEJWClddD6-VLHonQxSrb5BIcp2R1oD-XNmKLQhqFisnegrxx0KcNwrIQHeCVSFEdSgvFL7sk25gA7qW9IrVlWptGCHQIAPZHacW4VgHCv0aXXrJwoL4~qbLJwEXt7Y-YQ~AYJ1OVP6~SOZhHKAwCE4wRwdBJPsB2ZVeHoctrejYvu7EGOIVo0UE-ulkwSSaQ2yQ9NrYc16oWMKkQ__"
          alt="CollabEdge Logo"
          className="logo-img"
        />
      </div>

      {/* Profile Menu */}
      <div className="profile-container">
        <div className="profile-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          J
        </div>

        {isMenuOpen && (
          <div className="menu-dropdown">
            <div className="nameemail-container">
              <div className="nameTextStyle">User Name</div>
              <div className="emailTextStyle">user@example.com</div>
            </div>
            <button onClick={() => navigate("/create-admin")}>Create New Admin</button>
            <button onClick={() => navigate("/notification")}>Notifications</button>
            <button onClick={() => setIsLogoutDialogOpen(true)}>Logout</button>
          </div>
        )}
      </div>

      {/* Logout Dialog */}
      {isLogoutDialogOpen && (
        <div className="dialog-overlay">
          <div className="logout-dialog-box">
            <h2>Are you sure you want to log out?</h2>
            <div className="dialog-buttons">
              <button onClick={handleLogout} className="confirm-btn">Logout</button>
              <button onClick={() => setIsLogoutDialogOpen(false)} className="cancel-btn" style={{ marginTop: "10px" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Dialog */}
      {isDeleteUser && (
        <div className="dialog-overlay">
          <div className="logout-dialog-box">
            <h2>Are you sure you want to Delete this user and associated data?</h2>
            <div className="dialog-buttons">
              <button onClick={handleDeleteUserDialog} className="confirm-btn">Delete</button>
              <button onClick={() => setIsDeleteUser(false)} className="cancel-btn" style={{ marginTop: "10px" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Feed Display */}
      <div className="feed-container">
        {feedData.length > 0 ? (
          feedData.map((feed) => (
            <div key={feed._id} className="card">
              <div className="header">
                <div className="avatar">
                  {feed?.user?.fullName?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="author-info">
                  <h3>{feed?.user?.fullName || "Unknown User"}</h3>
                  <p>{feed?.user?.bio || "No bio available"}</p>
                </div>
              </div>
              <div className="content">
                <h2>Contact Details</h2>
                <div className="contact-info">
                  {feed?.user?.email && <p>Email: {feed.user.email}</p>}
                  {feed?.user?.skyId && <p>Skype ID: {feed.user.skyId}</p>}
                  {feed?.user?.phoneNumber && <p>Phone: {feed.user.phoneNumber}</p>}
                </div>
              </div>
              <hr className="divider" />
              <div className="actions">
                <div className="button-container">
                  <button className="post-button" onClick={() => navigate("/user-post")}>Post</button>
                  <button className="submitted-request-button" onClick={() => alert("Navigate to Submitted Requests")}>Submitted Request</button>
                  <button className="approved-request-button" onClick={() => alert("Navigate to Approved Requests")}>Approved Request</button>
                  <button
                    className="delete-button"
                    onClick={() => {
                      setDeleteUserID(feed._id); // Set the user ID to be deleted
                      setIsDeleteUser(true); // Open the delete confirmation dialog
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No feed available</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

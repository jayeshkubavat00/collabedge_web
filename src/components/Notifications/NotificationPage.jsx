import React, { useState, useEffect } from "react";
import axios from "axios";
import CommonAppBar from "../appbar"; // Assuming CommonAppBar stays the same
import "./NotificationPage.css"; // Import custom CSS file

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:5000/api/interest/approved-list",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);

      if (response.data.status) {
        const formattedNotifications = response.data.data.map((item) => ({
          id: item._id,
          message: `Your interest in "${item.feed?.title}" has been approved.`,
          name: item.feed?.user?.fullName,
          email: item.feed?.user?.email,
          feedTitle: item.feed?.title,
          description: item.feed?.description,
          bio:item.feed?.user?.bio,
          phone:item.feed?.user?.phoneNumber,
          skyId: item.feed?.user?.skyId,
        }));

        setNotifications(formattedNotifications);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      setErrorMessage("Error fetching notifications: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setErrorMessage("");
  };

  return (
    <div className="notification-container">
      <CommonAppBar title="Notifications" />
      <div className="notification-list">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <div key={notification.id} className="notification-card">
              <div className="notification-message">
                {notification.message}
              </div>

              <div className="notification-info">
                <div className="user-info">
                  <div className="user-avatar">
                    {notification.name.charAt(0)}
                  </div>
                  <div className="user-details">
                    <div className="user-name">{notification.name}</div>
                    <div className="user-bio">{notification.bio}</div>
                  </div>
                </div>

                <div className="contact-info">
                  <a href={`mailto:${notification.email}`} className="contact-item">
                    Email: {notification.email}
                  </a>
                  <a href={`tel:${notification.phone}`} className="contact-item">
                    Phone: {notification.phone}
                  </a>
                  <a href={`tel:${notification.skyId}`} className="contact-item">
                    SkypeID: {notification.skyId}
                  </a>
                </div>

                <div className="feed-info">
                  <div className="feed-title">Project Title: {notification.feedTitle}</div>
                  <div className="feed-description">
                    Description: {notification.description}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-notifications">
            No new notifications
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="error-snackbar">
          <div>{errorMessage}</div>
          <button onClick={handleSnackbarClose}>Close</button>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;

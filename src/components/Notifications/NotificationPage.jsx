import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Box,
  Grid,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { Email, Phone, LinkedIn } from "@mui/icons-material";
import CommonAppBar from "../appbar";
import "./NotificationPage.css";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
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

        if (response.data.status) {
          const formattedNotifications = response.data.data.map((item) => ({
            id: item._id,
            message: `Your interest in "${item.feed?.title}" has been approved.`,
            name: item.user.fullName,
            email: item.user.email,
            skyId: item.user.skypeId || "N/A",
            phone: item.user.contactNumber || "N/A",
            linkedin: item.user.linkedin || "#",
          }));

          setNotifications(formattedNotifications);
        } else {
          throw new Error(response.data.error);
        }
      } catch (error) {
        setErrorMessage("Error fetching notifications: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleSnackbarClose = () => {
    setErrorMessage("");
  };

  return (
    <div className="notification-container">
      <CommonAppBar title="Notifications" />
      <div className="notification-list">
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress />
          </Box>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className="notification-card"
              sx={{ mb: 2, p: 2, borderRadius: 2, boxShadow: 3 }}
            >
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                  {notification.message}
                </Typography>

                <Grid container spacing={2} alignItems="center" mt={1}>
                  <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ bgcolor: "#3B82F6", width: 56, height: 56 }}>
                      {notification.name.charAt(0)}
                    </Avatar>
                    <Box ml={2}>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        {notification.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {notification.skyId}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <IconButton color="primary" component="a" href={`mailto:${notification.email}`}>
                        <Email />
                      </IconButton>
                      <Typography variant="body2">{notification.email}</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <IconButton color="primary" component="a" href={`tel:${notification.phone}`}>
                        <Phone />
                      </IconButton>
                      <Typography variant="body2">{notification.phone}</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <IconButton
                        color="primary"
                        component="a"
                        href={notification.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LinkedIn />
                      </IconButton>
                      <Typography variant="body2">LinkedIn</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="h6" color="textSecondary" align="center">
            No new notifications
          </Typography>
        )}
      </div>

      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={errorMessage}
      />
    </div>
  );
};

export default NotificationPage;
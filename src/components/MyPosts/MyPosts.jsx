import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CommonAppBar from "../appbar";
import ShimmerLoader from "../ShimmerLoader";


const MyPosts = () => {
  const [feedData, setFeedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch user's posts
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/feed/get-profile-feed",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.status) {
          setFeedData(response.data.data);
        } else {
          setError("Failed to fetch posts");
        }
      } catch (err) {
        console.error("Error fetching feed data:", err);
        setError("Something went wrong. Please try again.");
      } finally {
        setTimeout(() => setLoading(false), 1000); // Ensures shimmer effect runs for 1 second
      }
    };

    fetchFeed();
  }, []);

  // Navigate to Interest Requests page
  const navigateToInterestRequests = (postId) => {
    navigate(`/interest-requests/${postId}`);
  };

  return (
    <div style={styles.container}>
      <CommonAppBar title="My Posts" />

      <div style={styles.mainContainer}>
        {loading ? (
          // Show shimmer effect while loading
          Array.from({ length: 3 }).map((_, index) => <ShimmerLoader key={index} />)
        ) : error ? (
          <p style={styles.error}>{error}</p>
        ) : feedData.length > 0 ? (
          feedData.map((feed) => (
            <div key={feed._id} style={styles.card}>
              {/* Author Information */}
              <div style={styles.header}>
                <div style={styles.avatar}>
                  {feed.user.fullName ? feed.user.fullName.charAt(0).toUpperCase() : ""}
                </div>
                <div style={styles.authorInfo}>
                  <h3 style={styles.authorName}>{feed.user.fullName}</h3>
                  <p style={styles.authorBio}>{feed.user.bio || "No bio available"}</p>
                </div>
              </div>

              {/* Post Content */}
              <div style={styles.content}>
                <h2 style={styles.title}>{feed.title}</h2>
                <p style={styles.description}>{feed.description}</p>
              </div>

              {/* Post Status */}
              <div style={styles.footer}>
                <span style={styles.status}>{feed.currentWork}</span>
              </div>

              <hr style={styles.divider} />

              {/* Action Buttons */}
              <div style={styles.actions}>
                <button
                  style={styles.connectButton}
                  onClick={() => navigateToInterestRequests(feed._id)}
                >
                  Show Connection Requests
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={styles.noPosts}>No posts available</p>
        )}
      </div>
    </div>
  );
};


const styles = {
  container: {
    marginTop: "60px",
    width: "100vw",
    overflowX: "hidden",
    backgroundColor: "#f4f5f7",
    paddingBottom: "40px",
    display: "flex",
    minWidth:"100vh",
    justifyContent: "flex-start", // Align list to the left
    paddingLeft: "10%", // Left padding to maintain alignment
  },
  mainContainer: {
    padding: "20px",
    minHeight: "100vh",
    minWidth:"100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start", // Align list items to the left
  },
  card: {
    backgroundColor: "white",
    
    color: "#333",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.08)",
    marginBottom: "20px",
    width: "150%", // 📏 Set width to 80% of screen
    transition: "transform 0.2s ease-in-out",
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#111827",
    textAlign: "left", // 🔄 Align title to the left
  },
  cardHover: {
    transform: "scale(1.02)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "50px",
    height: "50px",
    backgroundColor: "#007bff", // Brand color (20%)
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
  },
  authorInfo: {
    display: "flex",
    flexDirection: "column",
  },
  authorName: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#1e293b",
  },
  authorBio: {
    fontSize: "14px",
    color: "#6b7280",
  },
  content: {
    marginTop: "10px",
  },
  description: {
    fontSize: "16px",
    color: "#374151",
  },
  footer: {
    marginTop: "10px",
  },
  status: {
    backgroundColor: "#ffd700",
    color: "black",
    padding: "6px 12px",
    borderRadius: "10px",
    fontSize: "12px",
  },
  actions: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "center",
  },
  connectButton: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "12px 20px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "background 0.3s ease",
  },
  connectButtonHover: {
    backgroundColor: "#0056b3",
  },
  divider: {
    marginTop: "10px",
    border: "none",
    height: "1px",
    backgroundColor: "#ddd",
  },
  error: {
    color: "red",
    textAlign: "center",
    fontSize: "16px",
  },
  noPosts: {
    fontSize: "16px",
    color: "#6b7280",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // Takes full viewport height
    textAlign: "center",
    width: "170%", // Ensures full width for centering
  },

};

export default MyPosts;

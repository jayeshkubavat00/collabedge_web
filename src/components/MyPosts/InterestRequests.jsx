import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CommonAppBar from "../appbar";
import ShimmerLoader from "../ShimmerLoader";

const InterestRequests = () => {
  const { postId } = useParams();
  const [interestRequests, setInterestRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showShimmer, setShowShimmer] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowShimmer(false);
    }, 1000);

    const fetchInterestRequests = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/interest/requests/${postId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.status) {
          setInterestRequests(response.data.data);
        } else {
          setError(response.data.error || "Failed to fetch requests");
        }
      } catch (err) {
        setError("Error fetching requests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterestRequests();
  }, [postId]);

  const approveInterestRequest = async (interestId, userId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("User not authenticated. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/interest/approve",
        { interestId, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        alert("Interest request approved successfully!");
        setInterestRequests((prevRequests) =>
          prevRequests.filter((req) => req._id !== interestId)
        ); // Remove approved request from UI
      } else {
        alert(response.data.error || "Failed to approve request");
      }
    } catch (err) {
      alert("Error approving request. Please try again later.");
    }
  };

  if (loading) return <center><p>Loading...</p></center>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div>
      <CommonAppBar title="Interest Requests" />

      <div style={styles.contentWrapper}>
        <div style={styles.leftContainer}>
          {showShimmer ? (
            <>
              <ShimmerLoader />
              <ShimmerLoader />
              <ShimmerLoader />
            </>
          ) : interestRequests.length > 0 ? (
            interestRequests.map((request) => (
              <div key={request._id} style={styles.card}>
                <h3 style={styles.postTitle}>{request.title || "Untitled Post"}</h3>

                <div style={styles.userSection}>
                  <div style={styles.avatar}>
                    {request.user?.fullName ? request.user.fullName.charAt(0).toUpperCase() : "?"}
                  </div>
                  <div>
                    <strong style={styles.userName}>{request.user?.fullName || "Unknown User"}</strong>
                    <p style={styles.userEmail}>{request.user?.email || "No Email"}</p>
                  </div>
                </div>

                <p style={styles.message}><strong>Message:</strong> {request.message}</p>
                <hr className="divider" />

                <div className="actions">
                  <button
                    className="connect-button"
                    onClick={() => approveInterestRequest(request._id, request.user?._id)}
                  >
                    Approve Request
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={styles.noRequests}>No interest requests for this post yet.</p>
          )}
        </div>

        <div style={styles.rightContainer}>
          <img src="/logo.png" alt="App Logo" style={styles.logo} />
          <h2 style={styles.brandingTitle}>Welcome to IdeaConnect</h2>
          <p style={styles.brandingText}>
            Connect with like-minded people and collaborate on amazing ideas.
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  contentWrapper: {
    display: "flex",
    justifyContent: "space-between",
    width: "90%",
    maxWidth: "1400px",
    margin: "auto",
    padding: "20px",
    marginTop: "60px",
  },
  leftContainer: {
    width: "80%",
    paddingRight: "20px",
  },
  rightContainer: {
    width: "20%",
    backgroundColor: "#f5f5f5",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
    width: "100%",
  },
  postTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#333",
    textAlign: "left",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#eef2ff",
    padding: "10px",
    borderRadius: "10px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    backgroundColor: "#3b82f6",
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
  },
  userName: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#222",
  },
  userEmail: {
    fontSize: "12px",
    color: "#555",
  },
  message: {
    marginTop: "10px",
    fontSize: "14px",
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "10px",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
    color: "#222",
  },
  noRequests: {
    textAlign: "center",
    fontSize: "16px",
    color: "#666",
    marginTop: "20px",
  },
  logo: {
    width: "100px",
    marginBottom: "10px",
  },
  brandingTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#222",
    textAlign: "left",
  },
  brandingText: {
    fontSize: "14px",
    color: "#333",
    textAlign: "left",
  },
};

export default InterestRequests;

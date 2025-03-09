import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PullToRefresh from "react-pull-to-refresh";
import "./MainPage.css";
import ShimmerLoader from "../ShimmerLoader";

const MainPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [feedData, setFeedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null); // Store profile data

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile(); // Fetch profile when component mounts
    fetchFeed();
  }, []);

  const fetchProfile = async () => {
    try {
        const token = localStorage.getItem("token");
        console.log("Token:", token); // Check the token

        const response = await axios.get("http://localhost:5000/api/auth/profile", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Profile Response:", response); // Check the response

        if (response.data) {
            setUserProfile(response.data.user);
        }
    } catch (err) {
        console.error("Error fetching profile data:", err); // Check the error
    }
  };



  const fetchFeed = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/feed/get-feed", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.status) {
        setFeedData(response.data.data);
      } else {
        console.error("Failed to fetch feed:", response.data.message);
      }
    } catch (err) {
      console.error("Error fetching feed data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    await fetchFeed();
  };

  const handleSubmitConnect = async () => {
    if (!title || !description) {
      alert("Title and Description are required");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/interest/submit",
        {
          feedId: feedData[0]?._id, // Change this to dynamically get the correct feedId
          message: description,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.status) {
        alert("Interest submitted successfully");
        setIsDialogOpen(false);
      } else {
        alert("Failed to submit interest: " + response.data.error);
      }
    } catch (error) {
      console.error("Error submitting interest:", error);
      alert("Error submitting interest");
    }
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
          {userProfile?.fullName?.charAt(0).toUpperCase() || "J"}
        </div>

        {isMenuOpen && (
          <div className="menu-dropdown">
            <div className="nameemail-container">
              <div className="nameTextStyle">{userProfile?.fullName || "User Name"}</div>
              <div className="emailTextStyle">{userProfile?.email || "user@example.com"}</div>
            </div>

            <button onClick={() => navigate("/my-post")}>My Post</button>
            <button onClick={() => navigate("/editprofile")}>Edit Profile</button>
            <button onClick={() => navigate("/create-post")}>Create Post</button>
            <button onClick={() => navigate("/notification")}>Notifications</button>
            <button onClick={() => navigate("/submitted-connections")}>Submitted Connections</button>
            {/* <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("userID");
                navigate("/");
              }}
            >
              Logout
            </button> */}
            <button onClick={() => setIsLogoutDialogOpen(true)}>Logout</button>

          </div>
        )}
      </div>
      <div className="height-container"></div>

      {/* Pull to Refresh Wrapper */}
      <PullToRefresh onRefresh={handleRefresh}>
        {loading
          ? Array.from({ length: 3 }).map((_, index) => <ShimmerLoader key={index} />)
          : feedData.length > 0
          ? feedData.map((feed) => (
              <div key={feed._id} className="card">
                <div className="header">
                  <div className="avatar">
                    {feed.user.fullName ? feed.user.fullName.charAt(0).toUpperCase() : ""}
                  </div>
                  <div className="author-info">
                    <h3>{feed.user.fullName}</h3>
                    <p>{feed.user.email}</p>
                  </div>
                </div>

                <div className="content">
                  <h2>{feed.title}</h2>
                  <p>{feed.description}</p>
                </div>

                <div className="tags">
                  {feed.techStack.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="footer">
                  <span className="status">{feed.currentWork}</span>
                </div>

                <hr className="divider" />

                <div className="actions">
                  <button className="connect-button" onClick={() => setIsDialogOpen(true)}>
                    Connect
                  </button>
                </div>
              </div>
            ))
          : (
            <p>No feed available</p>
          )}
      </PullToRefresh>
      
      {/* Logout Dialog */}
      {isLogoutDialogOpen && (
        <div className="dialog-overlay">
          <div className="logout-dialog-box">
            <h2>Are you sure you want to logout?</h2>
            <button onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("userID");
                navigate("/");
              }}>Logout</button>
              <div className="height-container"></div>
            <button onClick={() => setIsLogoutDialogOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
      {/* Dialog Box */}
      {isDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <button className="close-button" onClick={() => setIsDialogOpen(false)}>✖</button>
            <h2 className="dialog-title">Connect with Project Owner</h2>
            <p>Send a request to connect with the project owner and collaborate.</p>
            <div className="height-container"></div>
            <input
              type="text"
              placeholder="Enter title"
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="height-container"></div>
            <textarea
              placeholder="Enter description"
              className="input-field"
              value={description}
              style={{ height: "100px" }}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button className="submit-button" onClick={handleSubmitConnect}>
              Submit Connect
            </button>
          </div>
        </div>
      )}
    </div>
    
  );
};

export default MainPage;

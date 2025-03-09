import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./SubmittedConnections.css";
import CommonAppBar from "../appbar";

const SubmittedConnections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch submitted connections when component mounts
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/interest/submitted-list", {
          method: "GET", // This might be a GET request
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        if (data.status) {
          setConnections(data.data); // Set the fetched connections to state
        } else {
          setError("No connections found");
        }
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []); // Empty dependency array means this will run once when the component mounts

  return (
    <div className="submitted-container">
      
      {/* Use CommonAppBar and pass title as a prop */}
      <CommonAppBar title="Submitted Connection" />
     
      {loading ? (
        <p>Loading...</p> // Display loading message while fetching
      ) : error ? (
        <p>{error}</p> // Display error if there is any issue
      ) : (
        <div className="submitted-list">
          {connections.length > 0 ? (
            connections.map((connection) => (
              <div key={connection._id} className="submitted-item">
                <p className="message">Status: { connection.status}</p>
                <div className="details">
                  <p><strong>Message:</strong> {connection.message}</p>
                  <p><strong>Post Title:</strong> {connection.feed.title}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-submissions">No submitted connections</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SubmittedConnections;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreatePost.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState([]);
  const [currentWork, setCurrentWork] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title || !description || !techStack.length || !currentWork) {
      setErrorMessage("Please fill all fields.");
      setShowErrorModal(true);
      return;
    }

    // API call data
    const postData = {
      title,
      description,
      techStack,
      currentWork
    };
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Authorization token is missing.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/feed/create-feed", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (response.ok) {
        // If API call is successful
        setSuccessMessage("Post created successfully!");
        setShowSuccessModal(true);
        setErrorMessage(""); // Clear any previous error message

        // Redirect to the feed page after successful post creation
        setTimeout(() => {
          navigate("/main");
        }, 2000); // Redirect after 2 seconds for the user to see the success message
      } else {
        // If API call fails
        setErrorMessage(data.error || "Something went wrong.");
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setErrorMessage("Server error. Please try again later.");
      setShowErrorModal(true);
    }
  };

  return (
    <div className="create-post-container">
      <h1>Create a New Post</h1>

      <div className="field">
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="field">
        <textarea
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      <div className="field">
        <input
          type="text"
          placeholder="Enter tech stack (comma separated)"
          value={techStack}
          onChange={(e) => setTechStack(e.target.value.split(","))}
        />
      </div>

      <div className="field">
        <input
          type="text"
          placeholder="Enter current work"
          value={currentWork}
          onChange={(e) => setCurrentWork(e.target.value)}
        />
      </div>

      <button onClick={handleSubmit}>Create Post</button>

      <button className="back-button" onClick={() => navigate("/main")}>
        Back to Feed
      </button>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content success-modal">
            <h2>{successMessage}</h2>
            <button onClick={() => setShowSuccessModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="modal-overlay">
          <div className="modal-content error-modal">
            <h2>{errorMessage}</h2>
            <button onClick={() => setShowErrorModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './admin_user_post_style.css';

const AdminUserPost = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch feeds from the API
    const fetchFeeds = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/post');
        setFeeds(response.data.data); // Assuming the response contains a 'data' field
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch feeds');
        setLoading(false);
      }
    };

    fetchFeeds();
  }, []);

  // Delete feed API
  const deleteFeed = async (feedId) => {
    try {
      await axios.delete(`YOUR_API_URL/feeds/${feedId}`);
      setFeeds(feeds.filter(feed => feed._id !== feedId)); // Remove feed from state after delete
    } catch (err) {
      setError('Failed to delete feed');
    }
  };

  return (
    <div className="feed-page-container">
      <h2>User Feeds</h2>
      {loading && <p>Loading feeds...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="feed-list">
        {feeds.map((feed) => (
          <div key={feed._id} className="feed-item">
            <h3>{feed.title}</h3>
            <p>{feed.description}</p>
            <p><strong>Tech Stack:</strong> {feed.techStack.join(', ')}</p>
            <button className="delete-btn" onClick={() => deleteFeed(feed._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUserPost;

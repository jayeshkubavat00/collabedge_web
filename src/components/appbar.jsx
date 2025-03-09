import React from "react";
import { useNavigate } from "react-router-dom";

// Common AppBar component
const CommonAppBar = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div style={styles.appBar}>
      <button style={styles.backBtn} onClick={() => navigate(-1)}>
        <i style={styles.icon} className="material-icons">arrow_back</i>
      </button>
      <div style={styles.title}>{title}</div>
    </div>
  );
};

// Inline styles for the AppBar component
const styles = {
  appBar: {
    display: "flex",
    alignItems: "center",
    padding: "12px 20px",
    color: "white",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    background: "#ffffff",
  },
  backBtn: {
    border: "none",
    background: "#f0f0f0",
    fontSize: "20px",
    cursor: "pointer",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "background 0.3s ease",
    marginRight: "15px",
  },
  backBtnHover: {
    background: "#e0e0e0",
  },
  icon: {
    fontSize: "24px",
    color: "#3b82f6",
  },
  title: {
    fontSize: "20px",
    fontWeight: "600",
    flexGrow: 1,
    color: "#3b82f6",
  },
};

export default CommonAppBar;

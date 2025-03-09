import React from "react";
import ContentLoader from "react-content-loader";

const ShimmerLoader = ({ width = "100%", height = 180 }) => {
  return (
    <ContentLoader
      speed={1.5}
      width={width}
      height={height}
      viewBox={`0 0 800 ${height}`}  // Increased width to 800
      backgroundColor="#e0e0e0"
      foregroundColor="#d6d6d6"
      style={{ width: "100%", marginBottom: "20px" }}
    >
      
      {/* User Section */}
      <circle cx="40" cy="130" r="25" />
      <rect x="80" y="120" rx="5" ry="5" width="50%" height="15" />
      <rect x="80" y="145" rx="5" ry="5" width="40%" height="12" />
      
      {/* Title */}
      <rect x="20" y="15" rx="5" ry="5" width="75%" height="20" />
      
      {/* Description */}
      <rect x="20" y="45" rx="5" ry="5" width="90%" height="15" />
      <rect x="20" y="70" rx="5" ry="5" width="85%" height="15" />
      
    </ContentLoader>
  );
};

export default ShimmerLoader;

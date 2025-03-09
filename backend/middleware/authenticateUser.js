const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  console.log("🟢 Middleware HIT: authenticateUser"); // ✅ Debugging

  const authHeader = req.header("Authorization");
  if (!authHeader) {
    console.log("🔴 No Authorization header found");
    return res.status(401).json({ status: false, error: "Access denied, no token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract Bearer token
  console.log("🔵 Extracted Token:", token);

  if (!token) {
    console.log("🔴 No token found after Bearer");
    return res.status(401).json({ status: false, error: "Access denied, invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🟢 Token Verified:", decoded);

    req.user = decoded; // Add user data to request object
    next();
  } catch (err) {
    console.log("🔴 JWT Verification Failed:", err.message);
    res.status(401).json({ status: false, error: "Invalid or expired token" });
  }
};

module.exports = authenticateUser;

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();

// ✅ Middleware to authenticate user using JWT
const authenticateUser = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ status: false, error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user payload to request object
    next(); // Move to the next middleware or route
  } catch (error) {
    return res.status(401).json({ status: false, error: "Unauthorized: Invalid token" });
  }
};

// ✅ Function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ✅ Register Route
router.post("/register", async (req, res) => {
  try {
    let { fullName, email, password } = req.body;

    fullName = fullName?.trim();
    email = email?.trim().toLowerCase();

    if (!fullName || !email || !password) {
      return res.status(400).json({ status: false, error: "All fields are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ status: false, error: "Invalid email format" });
    }

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: false, error: "Email already exists" });
    }

    if (password.length < 6) {
      return res.status(400).json({ status: false, error: "Password must be at least 6 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      status: true,
      message: "User registered successfully",
      data: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, error: "Server error", details: err.message });
  }
});


// ✅ Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ status: false, error: "Email and password are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ status: false, error: "Invalid email or password" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: false, error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: "2h" } // Token expiry (2 hours)
    );

    res.status(200).json({
      status: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, error: "Server error" });
  }
});
// ✅ Profile Route (Protected)
router.get("/profile", authenticateUser, async (req, res) => {
  try {
    // User details fetch karva, password chhodi ne
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "Profile fetched successfully", user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// Edit user profile API
router.put("/edit-profile", authenticateUser, async (req, res) => {
  const { fullName, email, skyId, bio, phoneNumber } = req.body; // Fields to update

  try {
    // Use req.user.id to get the authenticated user
    const user = await User.findById(req.user.id); // Use the authenticated user's ID

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Update the user fields
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.skyId = skyId || user.skyId;
    user.bio = bio || user.bio;
    user.phoneNumber = phoneNumber || user.phoneNumber;

    // Save the updated user profile
    await user.save();

    return res.status(200).json({ status: true, message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: "Server error", error: err.message });
  }
});

module.exports = router;

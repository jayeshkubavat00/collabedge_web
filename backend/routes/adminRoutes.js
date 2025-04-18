const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AdminUser = require("../models/AdminUser"); // AdminUser model
const User = require("../models/User"); // Assuming you have a User model
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

// Middleware to authenticate admin using JWT
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ status: false, error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // Attach admin payload to the request object
    next(); // Proceed to the next middleware or route
  } catch (error) {
    return res.status(401).json({ status: false, error: "Unauthorized: Invalid token" });
  }
};

// Admin Login Route
router.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: false, error: "Email and password are required" });
  }

  try {
    // Check if the admin user exists
    const admin = await AdminUser.findOne({ email });

    if (!admin) {
      return res.status(400).json({ status: false, error: "Email not found. Please register first." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ status: false, error: "Incorrect password. Please try again." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      status: true,
      message: "Login successful",
      token,
      user: { id: admin._id, fullName: admin.fullName, email: admin.email },
    });
  } catch (err) {
    res.status(500).json({ status: false, error: "Server error during login. Please try again later." });
  }
});


// Register Admin User
router.post("/create-admin", async (req, res) => {
  const { fullName, email, password, phone } = req.body;

  if (!fullName || !email || !password || !phone) {
    return res.status(400).json({ status: false, error: "All fields are required" });
  }

  try {
    // Check if email already exists
    const existingAdmin = await AdminUser.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ status: false, error: "Email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin user
    const newAdmin = new AdminUser({
      fullName,
      email,
      password: hashedPassword,
      phone,
    });

    // Save the new admin user
    await newAdmin.save();

    return res.status(201).json({
      status: true,
      message: "Admin user created successfully",
      data: {
        id: newAdmin._id,
        fullName: newAdmin.fullName,
        email: newAdmin.email,
        phone: newAdmin.phone,
      },
    });
  } catch (err) {
    res.status(500).json({ status: false, error: "Error creating admin" });
  }
});

// User List Route (Admin only)
router.get("/user-list", authenticateAdmin, async (req, res) => {
  try {
    // Fetch users from the database
    const users = await User.find().select("fullName email phoneNumber bio skyId");

    const userList = users.map((user) => ({
      _id: user._id,
      user: {
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber, // ✅ Correct field
        bio: user.bio,
        skyId: user.skyId,
      },
    }));

    res.status(200).json({
      status: true,
      message: "User list fetched successfully",
      data: userList,
    });
  } catch (err) {
    console.error("Error fetching user list:", err); // ✅ Debugging log
    res.status(500).json({ status: false, error: "Server error fetching user list" });
  }
});
router.delete("/api/admin/delete-user/:userId", authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    // Step 1: Delete all Interests related to the user's Feeds
    await Interest.deleteMany({ user: userId });

    // Step 2: Delete all Feeds associated with the user
    await Feed.deleteMany({ user: userId });

    // Step 3: Delete the user from the User collection
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res.json({ status: true, message: "User and associated data deleted successfully" });
  } catch (error) {
    console.error("Error during deletion:", error);
    res.status(500).json({ status: false, message: "Server error while deleting user" });
  }
});


// Get all posts for a specific user by their userId
router.get("/user/:userId/feeds", authenticateAdmin, async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch the feeds related to the given userId
    const feeds = await Feed.find({ user: userId }).populate("user", "fullName email"); // Populate user info if needed

    if (!feeds || feeds.length === 0) {
      return res.status(404).json({ status: false, message: "No feeds found for this user" });
    }

    res.status(200).json({
      status: true,
      message: "Feeds fetched successfully",
      data: feeds,
    });
  } catch (err) {
    console.error("Error fetching feeds:", err);
    res.status(500).json({ status: false, error: "Server error fetching user feeds" });
  }
});

// Delete a feed by ID
router.delete('/post/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    const deletedFeed = await Feed.findByIdAndDelete(postId);

    if (!deletedFeed) {
      return res.status(404).json({ status: false, error: 'Feed not found' });
    }

    return res.status(200).json({ status: true, message: 'Feed deleted successfully' });
  } catch (error) {
    console.error('Error deleting feed:', error);
    res.status(500).json({ status: false, error: 'Server error while deleting feed' });
  }
});

module.exports = router;

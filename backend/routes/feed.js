const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authenticateUser"); // Correct path
const Feed = require("../models/feed");

// ✅ Create a new feed post
router.post("/create-feed", authenticateUser, async (req, res) => {
  try {
    const { title, description, techStack, currentWork } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ status: false, error: "Title and description are required" });
    }

    // Create feed post
    const newFeed = new Feed({
      user: req.user.id,
      title,
      description,
      techStack: techStack || [],
      currentWork: currentWork || "",
    });

    await newFeed.save();

    res.status(201).json({ status: true, message: "Feed created successfully", data: newFeed });
  } catch (error) {
    console.error("Error creating feed:", error);
    res.status(500).json({ status: false, error: "Server error" });
  }
});

// ✅ Fetch all feed posts (Global Feed)
router.get("/get-feed", async (req, res) => {
  try {
    const globalFeeds = await Feed.find().populate("user", "fullName email bio").sort({ createdAt: -1 });

    res.status(200).json({ status: true, message: "Global feed retrieved", data: globalFeeds });
  } catch (error) {
    console.error("Error fetching global feed:", error);
    res.status(500).json({ status: false, error: "Server error" });
  }
});

// ✅ Fetch user's own feed posts
router.get("/get-profile-feed", authenticateUser, async (req, res) => {
  try {
    const myFeeds = await Feed.find({ user: req.user.id })
      .populate("user", "fullName email bio") // 👈 Fetch `fullName`, `email`, and `bio`
      .sort({ createdAt: -1 });

    res.status(200).json({ status: true, message: "User's feed retrieved", data: myFeeds });
  } catch (error) {
    console.error("Error fetching user feeds:", error);
    res.status(500).json({ status: false, error: "Server error" });
  }
});


module.exports = router;

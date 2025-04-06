const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authenticateUser");
const Interest = require("../models/Interest");
const Feed = require("../models/feed");
const User = require("../models/User");

// ✅ Submit Interest (Unchanged) Connect with idea
router.post("/submit", authenticateUser, async (req, res) => {
  try {
    const { feedId, message } = req.body;

    if (!feedId || !message) {
      return res.status(400).json({ status: false, error: "Feed ID and message are required" });
    }

    const feed = await Feed.findById(feedId);
    if (!feed) {
      return res.status(404).json({ status: false, error: "Feed not found" });
    }

    const newInterest = new Interest({
      user: req.user.id,
      feed: feedId,
      message,
    });

    await newInterest.save();

    res.status(201).json({ status: true, message: "Interest submitted successfully", data: newInterest });
  } catch (error) {
    console.error("Error submitting interest:", error);
    res.status(500).json({ status: false, error: "Server error" });
  }
});

// ✅ Get Submitted Interests (Unchanged) get list of submitting
router.get("/submitted-list", authenticateUser, async (req, res) => {
  try {
    const interests = await Interest.find({ user: req.user.id })
      .populate("feed", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({ status: true, message: "Submitted interests retrieved", data: interests });
  } catch (error) {
    console.error("Error fetching submitted interests:", error);
    res.status(500).json({ status: false, error: "Server error" });
  }
});

// ✅ Approve Interest (Now saves approver details) approve person to join with you
router.post("/approve", authenticateUser, async (req, res) => {
    try {
      const { interestId, userId } = req.body;
  
      if (!interestId || !userId) {
        return res.status(400).json({ status: false, error: "Interest ID and User ID are required" });
      }
  
      const interest = await Interest.findById(interestId).populate("feed");
      if (!interest) {
        return res.status(404).json({ status: false, error: "Interest not found" });
      }
  
      // Check if the logged-in user owns the feed post
      if (interest.feed.user.toString() !== req.user.id) {
        return res.status(403).json({ status: false, error: "You are not authorized to approve this interest" });
      }
  
      // Ensure that the interest is from the correct user
      if (interest.user.toString() !== userId) {
        return res.status(400).json({ status: false, error: "User ID does not match this interest request" });
      }
  
      interest.status = "approved";
      await interest.save();
  
      res.status(200).json({ status: true, message: "Interest approved successfully", data: interest });
    } catch (error) {
      console.error("Error approving interest:", error);
      res.status(500).json({ status: false, error: "Server error" });
    }
  });
  // ✅ Get Approved Interests (Includes Contact Info of post owner)
router.get("/approved-list", authenticateUser, async (req, res) => {
  // try {
  //   const userId = req.user.id;   // Logged-in user ID

  //   const approvedInterests = await Interest.find({ status: "approved" })
  //     .populate({
  //       path: "feed",
  //       match: { user: userId }, // Only show interests related to the logged-in user
  //       select: "title description user", // Only select title, description, and the post owner
  //     })
  //     .populate({
  //       path: "user", 
  //       select: "fullName email contactNumber" // Include the user's details
  //     })
  //     .populate({
  //       path: "feed.user",  // Populate the post owner's user details
  //       select: "fullName email contactNumber" // Add the post owner's details
  //     });

  //   // Filter out null feeds (to avoid returning unrelated interests)
  //   const filteredInterests = approvedInterests.filter((interest) => interest.feed !== null);

  //   res.status(200).json({
  //     status: true,
  //     message: "Approved interests for logged-in user with post owner details",
  //     data: filteredInterests,
  //   });
  // } catch (error) {
  //   console.error("Error fetching approved interests:", error);
  //   res.status(500).json({ status: false, error: "Server error" });
  // }
  try {
    // Fetch submitted interests by the logged-in user
    const interests = await Interest.find({ user: req.user.id, status: 'approved' })  // Filter by approved status
      .populate({
        path: "feed",
        select: "title description user", // Include post title, description, and the post owner's ID
        populate: {
          path: "user",  // Populate the user of the post (post owner)
          select: "fullName email phoneNumber bio skyId"  // Get the post owner's details
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Submitted interests retrieved with post owner details",
      data: interests,
    });
  } catch (error) {
    console.error("Error fetching submitted interests:", error);
    res.status(500).json({ status: false, error: "Server error" });
  }
});


  const mongoose = require("mongoose");
  router.get("/requests/:postId", authenticateUser, async (req, res) => {
    try {
      console.log("🔵 API HIT: /requests/:postId");
      const { postId } = req.params;
      console.log("Post ID Received:", postId);
  
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        console.log("🔴 Invalid Post ID");
        return res.status(400).json({ status: false, error: "Invalid Post ID" });
      }
  
      // ✅ Fetch interests and populate user & feed (post title & description)
      const interests = await Interest.find({ feed: postId })
        .populate("user", "fullName email skypeId")
        .populate("feed", "title description"); // ✅ Add this line to get post title & description
  
      console.log("Fetched Interests:", interests);
  
      if (!interests || interests.length === 0) {
        console.log("🔴 No interest requests found");
        return res.status(404).json({ status: false, error: "No interest requests found for this post" });
      }
  
      res.status(200).json({ status: true, message: "Interest requests fetched successfully", data: interests });
    } catch (error) {
      console.error("🔴 Error fetching interest requests:", error);
      res.status(500).json({ status: false, error: "Server error" });
    }
  });  
  

module.exports = router;

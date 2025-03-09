require("dotenv").config(); // Ensure this line is at the top
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

console.log("MongoDB URI:", process.env.MONGODB_URI); // Debugging line

const authRoutes = require("./routes/auth");
const feedRoutes = require("./routes/feed");
const interestRoutes = require("./routes/interest");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/interest", interestRoutes); // Register interest routes

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));

const mongoose = require("mongoose");

const FeedSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: { type: [String], default: [] },
    currentWork: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feed", FeedSchema);

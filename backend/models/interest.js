const mongoose = require("mongoose");

const InterestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User submitting interest
    feed: { type: mongoose.Schema.Types.ObjectId, ref: "Feed", required: true }, // Feed post
    message: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved"], default: "pending" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User who approved
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interest", InterestSchema);

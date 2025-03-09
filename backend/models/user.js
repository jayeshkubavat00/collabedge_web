const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const UserSchema = mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
      unique: true,
      default: uuidv4,  // Correctly using uuid for default userID
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    skyId: {
      type: String, // Added SkyID field
      required: false, // Optional field
    },
    bio: {
      type: String, // Added Bio field
      required: false, // Optional field
    },
    phoneNumber: {
      type: String, // Added Phone Number field
      required: false, // Optional field
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

const mongoose = require("mongoose");
var validator = require("validator");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: [true, "Please provide your first name"],
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, "Please provide your last name"],
  },
  displayName: {
    type: String,
    trim: true,
    maxLength: 30,
  },
  bio: {
    type: String,
    trim: true,
    maxLength: 300,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide an email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide your password"],
    minLength: 6,
  },
  profileImage: {
    type: String,
    default: "/assets/images/no-profile.jpg",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);

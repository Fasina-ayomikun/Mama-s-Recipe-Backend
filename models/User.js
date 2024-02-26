const mongoose = require("mongoose");
var validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema(
  {
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

      minLength: 6,
    },
    loggedInWithOAuth: {
      type: Boolean,
      required: true,
      default: false,
    },
    profileImage: {
      id: {
        type: String,
        required: [true, "Provide image id"],
      },
      url: {
        type: String,
        required: [true, "Provide image url"],
        default: "/assets/images/no-profile.jpg",
      },
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "user", "store manager"],
        message: "{VALUE} is not a role",
      },
      default: "user",
    },
  },
  { timestamps: true }
);
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);
  console.log(hash);
  this.password = hash;
  next();
});
UserSchema.methods.generateJWTToken = function (user) {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
      loggedInWithOAuth: user.loggedInWithOAuth,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
module.exports = mongoose.model("User", UserSchema);

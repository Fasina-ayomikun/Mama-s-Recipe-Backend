const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user id"],
    },
    token: {
      type: String,
      required: [true, "Provide a token"],
    },
    tokenExpirationDate: {
      type: Date,
      default: Date.now() + 10 * 60 * 1000,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", TokenSchema);

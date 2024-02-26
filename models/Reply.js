const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema(
  {
    commenterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reply: {
      type: String,
    },
    reviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reviews",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Reply", ReplySchema);

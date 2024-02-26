const NotFoundError = require("../errors/not-found");
const Reply = require("../models/Reply");
const Reviews = require("../models/Reviews");

module.exports.createReviewReply = async (req, res) => {
  const { id: reviewId } = req.params;
  const reviewExist = await Reviews.findById(reviewId);
  if (!reviewExist) {
    throw new NotFoundError("Review does not exist");
  }
  req.body.commenterId = req.user.userId;
  const reply = await Reply.create({ ...req.body, reviewId });
  res.status(201).json({ success: true, msg: "Reply created", reply });
};

module.exports.getReviewReplies = async (req, res) => {
  console.log("here");
  const { id: reviewId } = req.params;
  const reviewExist = await Reviews.findById(reviewId);
  if (!reviewExist) {
    throw new NotFoundError("Review does not exist");
  }
  req.body.commenterId = req.user.userId;
  const replies = await Reply.find({ reviewId });
  res.status(200).json({ success: true, msg: "replies gotten", replies });
};
module.exports.updateReviewReply = async (req, res) => {
  const { id: replyId } = req.params;
  const reply = await Reply.findById(replyId);
  if (!reply) {
    throw new NotFoundError("Reply does not exist");
  }
  reply.reply = req.body.reply;
  await reply.save();
  res.status(200).json({ success: true, msg: "Reply updated  successfully" });
};
module.exports.deleteReviewReply = async (req, res) => {
  const { id: replyId } = req.params;
  const reply = await Reply.findById(replyId);
  if (!reply) {
    throw new NotFoundError("Reply does not exist");
  }
  await Reply.deleteOne({ _id: replyId });
  res.status(200).json({ success: true, msg: "Reply deleted  successfully" });
};

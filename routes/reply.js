const express = require("express");
const { authenticateUser } = require("../middlewares/authenticate");
const {
  getReviewReplies,
  updateReviewReply,
  deleteReviewReply,
  createReviewReply,
} = require("../controllers/reply");
const router = express.Router();

router.route("/all/:id").get(getReviewReplies);
router.route("/new/:id").post(authenticateUser, createReviewReply);
router
  .route("/:id")
  .patch(authenticateUser, updateReviewReply)
  .delete(authenticateUser, deleteReviewReply);

module.exports = router;

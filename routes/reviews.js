const express = require("express");
const {
  updateReview,
  deleteReview,
  createReview,
  getSingleReview,
  getAllRecipeReviews,
} = require("../controllers/reviews");
const { authenticateUser } = require("../middlewares/authenticate");
const router = express.Router();
router.route("/").post(authenticateUser, createReview);
router
  .route("/:id")
  .get(getAllRecipeReviews)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);
module.exports = router;

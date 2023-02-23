const BadRequestError = require("../errors/bad-request");
const NotFoundError = require("../errors/not-found");
const Recipe = require("../models/Recipe");
const Reviews = require("../models/Reviews");
const checkError = require("../utils/checkError");
const checkPermission = require("../utils/checkPermission");

const createReview = async (req, res) => {
  try {
    const { recipe: recipeId } = req.body;
    // Check if Recipe Exists
    const isRealRecipe = await Recipe.findOne({ _id: recipeId });
    if (!isRealRecipe) {
      throw new BadRequestError("This Recipe does not exist");
    }
    // check if a review has already being submitted
    const reviewAlreadySubmitted = await Reviews.findOne({
      recipe: recipeId,
      user: req.user.userId,
    });
    if (reviewAlreadySubmitted) {
      throw new BadRequestError("This Product has already been reviewed");
    }
    req.body.user = req.user.userId;
    const newReview = await Reviews.create(req.body);
    res.status(201).json({
      success: true,
      review: newReview,
      msg: "Review successfully created",
    });
  } catch (error) {
    checkError(res, error);
  }
};
const updateReview = async (req, res) => {
  try {
    const { id: reviewId } = req.params;
    const { ratings, comment, title } = req.body;
    //  Check if review exists
    const review = await Reviews.findOne({ _id: reviewId });
    if (!review) {
      throw new NotFoundError(`No review with id: ${reviewId}`);
    }
    checkPermission(req.user.userId, review.user);

    review.ratings = ratings;
    review.title = title;
    review.comment = comment;

    await review.save();
    res.status(200).json({ success: true, msg: "Review successfully updated" });
  } catch (error) {
    checkError(res, error);
  }
};

const getAllRecipeReviews = async (req, res) => {
  try {
    const sort = { createdAt: -1 };
    const { id: recipeId } = req.params;
    const reviews = await Reviews.find({ recipe: recipeId })
      .sort(sort)
      .populate({
        path: "recipe",
        select: "name image averageRatings noOfReviews ",
      })
      .populate({
        path: "user",
        select:
          "firstName lastName profileImage displayName bio createdAt email",
      });
    res.status(200).json({ success: true, reviews, length: reviews.length });
  } catch (error) {
    checkError(res, error);
  }
};
const getSingleReview = async (req, res) => {
  try {
    const { id: reviewId } = req.params;

    const review = await Reviews.findOne({ _id: reviewId }).populate({
      path: "recipe",
      select: "name image averageRatings noOfReviews ",
    });
    if (!review) {
      throw new NotFoundError(`No review with id ${reviewId}`);
    }
    res.status(200).json({ success: true, review });
  } catch (error) {
    checkError(res, error);
  }
};
const deleteReview = async (req, res) => {
  try {
    const { id: reviewId } = req.params;
    const review = await Reviews.findOne({ _id: reviewId });
    if (!review) {
      throw new NotFoundError(`No review with id: ${reviewId}`);
    }
    checkPermission(req.user.userId, review.user);
    await review.remove();
    res.status(200).json({ success: true, msg: "Review successfully deleted" });
  } catch (error) {
    checkError(res, error);
  }
};

module.exports = {
  createReview,
  deleteReview,
  updateReview,
  getAllRecipeReviews,
  getSingleReview,
};

const mongoose = require("mongoose");
var validator = require("validator");

const ReviewsSchema = new mongoose.Schema({
  ratings: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, "Please provide a rating"],
  },
  title: {
    type: String,
    required: [true, "Please provide a title"],
    trim: true,
    maxLength: 30,
  },
  comment: {
    type: String,
    required: [true, "Please share your comment"],
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  recipe: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Recipe",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ReviewsSchema.statics.calculateReviews = async function (recipeId) {
  const result = await this.aggregate([
    { $match: { recipe: recipeId } },
    {
      $group: {
        _id: null,
        averageRatings: { $avg: "$ratings" },
        noOfReviews: { $sum: 1 },
      },
    },
  ]);
  try {
    await this.model("Recipe").findOneAndUpdate(
      { _id: recipeId },
      {
        averageRatings: Math.ceil(result[0]?.averageRatings || 0),
        noOfReviews: result[0]?.noOfReviews || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};
// Call method when Review is updated
ReviewsSchema.post("save", async function () {
  await this.constructor.calculateReviews(this.recipe);
});
// Call method when Review is deleted
ReviewsSchema.post("remove", async function () {
  await this.constructor.calculateReviews(this.recipe);
});

module.exports = mongoose.model("Reviews", ReviewsSchema);

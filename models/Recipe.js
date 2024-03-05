const mongoose = require("mongoose");
var validator = require("validator");

const RecipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide a  recipe name "],
    },
    description: {
      type: String,
      required: [true, "Please provide a short description"],
      maxLength: 1000,
    },
    images: [
      {
        id: {
          type: String,
          required: [true, "Please provide images for your Recipe image id"],
        },
        url: {
          type: String,
          required: [true, "Please provide images for your Recipe image path"],
        },
      },
    ],

    equipments: {
      type: Array,
      required: [true, "Please list the equipments used"],
    },
    ingredients: {
      type: Array,
      required: [true, "Please list the ingredients used"],
    },
    instructions: [
      {
        step: {
          type: Number,
          required: [true, "Please provide Recipe instructions"],
        },
        details: {
          type: String,
          required: [true, "Please provide Recipe instructions"],
        },
      },
    ],

    averageRatings: {
      type: Number,
      default: 0,
    },
    noOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likers: {
      type: Array,
    },
    noOfLikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", RecipeSchema);

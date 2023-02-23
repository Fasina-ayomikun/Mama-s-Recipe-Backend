const mongoose = require("mongoose");
var validator = require("validator");

const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Please provide a name "],
  },
  description: {
    type: String,
    required: [true, "Please provide a short description"],
    maxLength: 1000,
  },
  image: {
    type: String,
    required: [true, "Please provide an image for your Recipe"],
  },
  video: {
    type: String,
  },
  equipments: {
    type: Array,
    required: [true, "Please list the equipments used"],
  },
  ingredients: {
    type: Array,
    required: [true, "Please list the ingredients used"],
  },
  instructions: {
    type: Array,
    required: [true, "Please provided the necessary instructions"],
  },

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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Recipe", RecipeSchema);

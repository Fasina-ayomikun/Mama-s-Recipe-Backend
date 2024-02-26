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
    video: {
      id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    equipments: {
      type: Array,
      //TODO:Uncomment this
      // required: [true, "Please list the equipments used"],
    },
    ingredients: {
      type: Array,
      //TODO:Uncomment this
      // required: [true, "Please list the ingredients used"],
    },
    instructions: [
      {
        step: {
          type: Number,
          //TODO:Uncomment this
          // required: [true, "Please provide instruction step number"],
        },
        details: {
          type: String,
          //TODO:Uncomment this
          // required: [true, "Please provide instruction step details"],
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

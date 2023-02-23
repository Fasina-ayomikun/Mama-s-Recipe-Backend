const BadRequestError = require("../errors/bad-request");
const NotFoundError = require("../errors/not-found");
const Recipe = require("../models/Recipe");
const checkError = require("../utils/checkError");
const path = require("path");
const checkPermission = require("../utils/checkPermission");
const Reviews = require("../models/Reviews");
const getAllRecipes = async (req, res) => {
  try {
    // Sort the Recipes with createdAt
    const sort = { createdAt: -1 };
    const recipes = await Recipe.find().sort(sort).populate({
      path: "user",
      select: "firstName lastName profileImage displayName email bio createdAt",
    });
    res.json({ success: true, recipes, length: recipes.length });
  } catch (error) {
    checkError(res, error);
  }
};
const getUserRecipes = async (req, res) => {
  try {
    const { userId } = req.params;
    const sort = { createdAt: -1 };
    const recipes = await Recipe.find({ user: userId }).sort(sort);
    res.status(200).json({ success: true, recipes, length: recipes.length });
  } catch (error) {
    checkError(res, error);
  }
};
const createRecipe = async (req, res) => {
  try {
    req.body.user = req.user.userId;
    const recipe = await Recipe.create(req.body);
    res
      .status(201)
      .json({ success: true, msg: "Recipe successfully created", recipe });
  } catch (error) {
    checkError(res, error);
  }
};
const updateRecipe = async (req, res) => {
  try {
    const { id: recipeId } = req.params;

    const recipe = await Recipe.findOne({ _id: recipeId });
    // Check if user is authorized to access this route
    checkPermission(req.user.userId, recipe.user);
    // Check if Recipe exists
    if (!recipe) {
      throw new NotFoundError(`No recipe with id: ${recipeId}`);
    }
    await Recipe.updateOne({ _id: recipeId }, req.body);

    res.status(200).json({ success: true, msg: "Recipe successfully updated" });
  } catch (error) {
    checkError(res, error);
  }
};
const deleteRecipe = async (req, res) => {
  try {
    const { id: recipeId } = req.params;
    const recipe = await Recipe.findOne({ _id: recipeId });
    //  Check if Recipe exists
    if (!recipe) {
      throw new NotFoundError(`No recipe with id: ${recipeId}`);
    }

    // Check if user is authorized to access this route
    checkPermission(req.user.userId, recipe.user);
    await recipe.remove();
    res.status(200).json({ success: true, msg: "Recipe successfully deleted" });
  } catch (error) {
    checkError(res, error);
  }
};
const singleRecipe = async (req, res) => {
  try {
    const { id: recipeId } = req.params;
    const recipe = await Recipe.findById({ _id: recipeId }).populate({
      path: "user",
      select: "firstName lastName profileImage bio createdAt displayName email",
    });

    if (!recipe) {
      throw new NotFoundError(`No recipe with id: ${recipeId}`);
    }

    res.status(200).json({ success: true, recipe });
  } catch (error) {
    checkError(res, error);
  }
};

module.exports = {
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  singleRecipe,

  getUserRecipes,
};

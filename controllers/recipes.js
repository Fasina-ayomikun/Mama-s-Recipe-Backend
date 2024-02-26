const BadRequestError = require("../errors/bad-request");
const NotFoundError = require("../errors/not-found");
const Recipe = require("../models/Recipe");
const checkError = require("../utils/checkError");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const checkPermission = require("../utils/checkPermission");
const Reviews = require("../models/Reviews");
const { imageUploader } = require("../utils/imageHandler");
const helperClass = require("../utils/helperClass");
const getAllRecipes = async (req, res) => {
  // Sort the Recipes with createdAt
  const sort = { createdAt: -1 };

  const newBase = new helperClass(Recipe.find(), req.query).search().filter();
  let recipes = await newBase.base.sort(sort).populate({
    path: "user",
    select:
      "firstName lastName profileImage  displayName email role bio createdAt",
  });
  const filteredProductNumber = recipes.length;
  newBase.getLimitedResult(10);
  res.json({ success: true, recipes, length: filteredProductNumber });
};
const getUserRecipes = async (req, res) => {
  const { userId } = req.params;
  const sort = { createdAt: -1 };
  const recipes = await Recipe.find({ user: userId }).sort(sort);
  res.status(200).json({ success: true, recipes, length: recipes.length });
};
const createRecipe = async (req, res) => {
  req.body.user = req.user.userId;
  let images = [];
  console.log(req.body);
  if (req.files) {
    const files = req.files.images;
    console.log(files);
    for (let i = 0; i < files.length; i++) {
      const result = await imageUploader(files[i].tempFilePath);
      images.push({ id: result.public_id, url: result.secure_url });
    }
  }
  const recipe = await Recipe.create({ ...req.body, images });
  res
    .status(201)
    .json({ success: true, msg: "Recipe successfully created", recipe });
};
const updateRecipe = async (req, res) => {
  const { id: recipeId } = req.params;

  const recipe = await Recipe.findOne({ _id: recipeId });
  // Check if user is authorized to access this route
  checkPermission(req.user.userId, recipe.user);
  // Check if Recipe exists
  if (!recipe) {
    throw new NotFoundError(`No recipe with id: ${recipeId}`);
  }
  let images = [];
  const newData = {
    ...req.body,
  };
  if (req.files) {
    const files = req.files.images;
    for (let i = 0; i < recipe.images.length; i++) {
      await cloudinary.uploader.destroy(recipe.images[i].id);
    }
    for (let i = 0; i < files.length; i++) {
      const result = await imageUploader(files[i].tempFilePath);
      images.push({ id: result.public_id, url: result.secure_url });
    }
    newData.images = images;
  }
  await Recipe.updateOne({ _id: recipeId }, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({ success: true, msg: "Recipe successfully updated" });
};
const deleteRecipe = async (req, res) => {
  const { id: recipeId } = req.params;
  const recipe = await Recipe.findById(recipeId);
  //  Check if Recipe exists
  if (!recipe) {
    throw new NotFoundError(`No recipe with id: ${recipeId}`);
  }

  // Check if user is authorized to access this route
  checkPermission(req.user.userId, recipe.user);
  for (let i = 0; i < recipe.images.length; i++) {
    await cloudinary.uploader.destroy(recipe.images[i].id);
  }
  await recipe.deleteOne();
  res.status(200).json({ success: true, msg: "Recipe successfully deleted" });
};
const singleRecipe = async (req, res) => {
  const { id: recipeId } = req.params;
  const recipe = await Recipe.findById({ _id: recipeId }).populate({
    path: "user",
    select:
      "firstName lastName profileImage bio createdAt displayName role email",
  });

  if (!recipe) {
    throw new NotFoundError(`No recipe with id: ${recipeId}`);
  }

  res.status(200).json({ success: true, recipe });
};
const toggleLike = async (req, res) => {
  const { id: recipeId } = req.params;

  const recipe = await Recipe.findById(recipeId);
  //  Check if Recipe exists
  if (!recipe) {
    throw new NotFoundError(`No recipe with id: ${recipeId}`);
  }
  if (recipe.likers.includes(req.user.userId)) {
    const newArray = recipe.likers.filter((liker) => liker !== req.user.userId);
    recipe.likers = newArray;
    recipe.noOfLikes -= 1;
    await recipe.save();
    console.log(recipe.noOfLikes);
    res.status(200).json({ success: true, msg: "Recipe unlike" });
    return;
  }
  recipe.likers.push(req.user.userId);
  recipe.noOfLikes += 1;
  console.log(recipe.noOfLikes);
  await recipe.save();
  res.status(200).json({ success: true, msg: "Recipe liked" });
};
module.exports = {
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  singleRecipe,
  getUserRecipes,
  toggleLike,
};

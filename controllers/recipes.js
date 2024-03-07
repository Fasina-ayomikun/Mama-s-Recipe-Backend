const BadRequestError = require("../errors/bad-request");
const NotFoundError = require("../errors/not-found");
const Recipe = require("../models/Recipe");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const checkPermission = require("../utils/checkPermission");
const { fileUploader } = require("../utils/fileHandler");
const helperClass = require("../utils/helperClass");
const User = require("../models/User");
const { addCookies } = require("../utils/addCookies");
const getAllRecipes = async (req, res) => {
  console.log("recipes", req.signedCookies.token);
  // Sort the Recipes with createdAt
  let sortQuery = { createdAt: -1 };
  const totalLength = await Recipe.collection.countDocuments();
  if (req.query.sort) {
    const { sort } = req.query;
    if (sort === "popularity") {
      sortQuery = { averageRatings: -1 };
    } else if (sort === "latest") {
      sortQuery = { createdAt: -1 };
    } else if (sort === "oldest") {
      sortQuery = { createdAt: 1 };
    }
  }
  const newBase = new helperClass(Recipe.find(), req.query).search().filter();
  newBase.getLimitedResult(10);
  let recipes = await newBase.base.sort(sortQuery).populate({
    path: "user",
    select:
      "firstName lastName profileImage  displayName email role bio createdAt",
  });
  res.json({
    success: true,
    recipes,
    totalLength,
    length: recipes.length,
  });
};
const getAllRecipesSingleDetail = async (req, res) => {
  const recipes = await Recipe.find({});

  const ingredientArray = recipes.map((recipe) => {
    return recipe.ingredients;
  });
  let ingredients = ingredientArray.reduce((total, arr) => {
    return [...total, ...arr];
  }, []);
  ingredients = Array.from(new Set(ingredients));
  const equipmentArray = recipes.map((recipe) => {
    return recipe.equipments;
  });
  let equipments = equipmentArray.reduce((total, arr) => {
    return [...total, ...arr];
  }, []);
  equipments = Array.from(new Set(equipments));
  res.status(200).json({ ingredients, equipments });
};
const getUserRecipes = async (req, res) => {
  const { userId } = req.params;
  const sort = { createdAt: -1 };
  let { page } = req.query;
  if (!page) {
    page = 1;
  }
  const totalLength = await Recipe.collection.countDocuments();
  const skipValue = (page - 1) * 10;
  const recipes = await Recipe.find({ user: userId })
    .sort(sort)
    .limit(10)
    .skip(skipValue)
    .populate({
      path: "user",
      select:
        "firstName lastName profileImage  displayName email role bio createdAt",
    });
  res
    .status(200)
    .json({ success: true, recipes, length: recipes.length, totalLength });
};
const createRecipe = async (req, res) => {
  req.body.user = req.user.userId;

  let images = [];
  if (req.files) {
    const imagesFiles = req.files.images;
    if (imagesFiles) {
      for (let i = 0; i < imagesFiles.length; i++) {
        const result = await fileUploader(imagesFiles[i].tempFilePath);
        images.push({ id: result.public_id, url: result.secure_url });
      }
    }
  }
  if (req.body.instructions) {
    req.body.instructions = JSON.parse(req.body.instructions);
  }
  const recipe = await Recipe.create({
    ...req.body,
    images,
  });
  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    { role: "store manager" },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  addCookies({ res, user });
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
  if (req.body.instructions) {
    newData.instructions = JSON.parse(req.body.instructions);
  }
  if (req.files) {
    const files = req.files.images;
    if (files) {
      for (let i = 0; i < recipe.images.length; i++) {
        await cloudinary.uploader.destroy(recipe.images[i].id);
      }
      for (let i = 0; i < files.length; i++) {
        const result = await fileUploader(files[i].tempFilePath);
        images.push({ id: result.public_id, url: result.secure_url });
      }
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
const getUserFavoritesRecipes = async (req, res) => {
  const { userId } = req.params;
  const sort = { createdAt: -1 };
  const recipes = await Recipe.find({ likers: { $in: [userId] } })
    .sort(sort)
    .populate({
      path: "user",
      select:
        "firstName lastName profileImage  displayName email role bio createdAt",
    });
  res.status(200).json({ success: true, recipes, length: recipes.length });
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
    res.status(200).json({
      success: true,
      msg: "Recipe unlike",
      noOfLikes: recipe.noOfLikes,
      likers: recipe.likers,
    });
    return;
  }
  recipe.likers.push(req.user.userId);
  recipe.noOfLikes += 1;
  await recipe.save();
  res.status(200).json({
    success: true,
    msg: "Recipe liked",
    noOfLikes: recipe.noOfLikes,
    likers: recipe.likers,
  });
};
module.exports = {
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  singleRecipe,
  getUserRecipes,
  toggleLike,
  getUserFavoritesRecipes,
  getAllRecipesSingleDetail,
};

const express = require("express");
const {
  getAllRecipes,
  updateRecipe,
  deleteRecipe,
  createRecipe,
  singleRecipe,
  getUserRecipes,
} = require("../controllers/recipes");
const { authenticateUser } = require("../middlewares/authenticate");
const router = express.Router();
router.route("/").get(getAllRecipes).post(authenticateUser, createRecipe);
router
  .route("/:id")
  .get(authenticateUser, singleRecipe)
  .patch(authenticateUser, updateRecipe)
  .delete(authenticateUser, deleteRecipe);
router.route("/user/:userId").get(authenticateUser, getUserRecipes);
module.exports = router;

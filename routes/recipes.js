const express = require("express");
const {
  getAllRecipes,
  updateRecipe,
  deleteRecipe,
  createRecipe,
  singleRecipe,
  getUserRecipes,
  toggleLike,
} = require("../controllers/recipes");
const {
  authenticateUser,
  checkRolesPermission,
} = require("../middlewares/authenticate");
const router = express.Router();
router.route("/").get(getAllRecipes).post(authenticateUser, createRecipe);
router.route("/like/:id").get(authenticateUser, toggleLike);
router
  .route("/:id")
  .get(authenticateUser, singleRecipe)
  .patch(
    authenticateUser,
    checkRolesPermission("admin", "store manager"),
    updateRecipe
  )
  .delete(
    authenticateUser,
    checkRolesPermission("admin", "store manager"),
    deleteRecipe
  );
router.route("/user/:userId").get(authenticateUser, getUserRecipes);
module.exports = router;

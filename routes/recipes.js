const express = require("express");
const {
  getAllRecipes,
  updateRecipe,
  deleteRecipe,
  createRecipe,
  singleRecipe,
  getUserRecipes,
  toggleLike,
  getAllRecipesSingleDetail,
  getUserFavoritesRecipes,
} = require("../controllers/recipes");
const {
  authenticateUser,
  checkRolesPermission,
} = require("../middlewares/authenticate");
const router = express.Router();
router.route("/").get(getAllRecipes).post(authenticateUser, createRecipe);
router.route("/details").get(getAllRecipesSingleDetail);
router.route("/user/:userId").get(getUserRecipes);
router.route("/favorite/:userId").get(getUserFavoritesRecipes);

router.route("/like/:id").get(authenticateUser, toggleLike);

router
  .route("/:id")
  .get(singleRecipe)
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
module.exports = router;

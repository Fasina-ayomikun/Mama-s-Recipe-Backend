const express = require("express");
const {
  updateUserDetails,
  singleUser,
  getAllUsers,
  deleteUser,
} = require("../controllers/user");
const {
  authenticateUser,
  checkRolesPermission,
} = require("../middlewares/authenticate");
const router = express.Router();
router
  .route("/")
  .get(authenticateUser, checkRolesPermission("admin"), getAllUsers);
router
  .route("/:id")
  .get(singleUser)
  .patch(
    authenticateUser,
    checkRolesPermission("admin", "user", "store manager"),
    updateUserDetails
  )
  .delete(authenticateUser, checkRolesPermission("admin"), deleteUser);
module.exports = router;

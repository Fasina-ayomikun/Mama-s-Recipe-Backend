const express = require("express");
const {
  register,
  login,
  logout,
  forgotPasswordRequestController,
  forgotPasswordController,
} = require("../controllers/auth");
const { authenticateUser } = require("../middlewares/authenticate");
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(authenticateUser, logout);
router.route("/forgot-password").post(forgotPasswordRequestController);
router.route("/forgot-password/reset/:token").post(forgotPasswordController);
module.exports = router;

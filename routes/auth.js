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
router.get(
  "/user",

  (req, res) => {
    if (req.user) {
      addCookies({ res, user: req.user });

      res
        .status(200)
        .json({ success: true, msg: "Login successful", user: req.user });
    } else {
      res.status(500).json({ success: false, msg: "Seems there was an error" });
    }
  }
);
module.exports = router;

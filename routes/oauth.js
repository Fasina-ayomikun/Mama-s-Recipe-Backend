const express = require("express");
const router = express.Router();
const passport = require("../passport/passport");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  (req, res) => {
    console.log("goten");
  }
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.json({
      user: req.user,
    });
  }
);
router.route("/github").get(
  passport.authenticate("github", {
    scope: ["user:email"],
    failureRedirect: "/",
  }),
  (req, res) => {
    res.json({
      user: req.user,
    });
  }
);
router
  .route("/github/callback")
  .get(passport.authenticate("github"), (req, res) => {
    res.json({
      user: req.user,
    });
  });

module.exports = router;

const express = require("express");
const router = express.Router();
const passport = require("../passport/passport");
const { addCookies } = require("../utils/addCookies");

router.get(
  "/user",

  (req, res) => {
    if (req.user) {
      addCookies({ res, user: req.user });

      res
        .status(200)
        .json({ success: true, msg: "Login successful", user: req.user });
    } else {
      res.status(404).json({ success: false, msg: "Seems there was an error" });
    }
  }
);

router.get(
  "/google",

  passport.authenticate("google", { scope: ["profile", "email"] }),
  (req, res) => {}
);

router.get(
  "/google/callback",

  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_LINK}/login`,
  }),
  (req, res) => {
    addCookies({ res, user: req.user });
    res.redirect(`${process.env.FRONTEND_LINK}`);
  }
);

router.route("/github").get(
  passport.authenticate("github", {
    scope: ["user:email"],
  }),
  (req, res) => {}
);
router.route("/github/callback").get(
  passport.authenticate("github", {
    failureRedirect: `${process.env.FRONTEND_LINK}/login`,
  }),
  (req, res) => {
    addCookies({ res, user: req.user });

    res.redirect(`${process.env.FRONTEND_LINK}`);
  }
);
router
  .route("/facebook")
  .get(passport.authenticate("facebook"), (req, res) => {});
router.route("/facebook/callback").get(
  passport.authenticate("facebook", {
    failureRedirect: `${process.env.FRONTEND_LINK}/login`,
  }),
  (req, res) => {
    addCookies({ res, user: req.user });

    res.redirect(`${process.env.FRONTEND_LINK}`);
  }
);

module.exports = router;

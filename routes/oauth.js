const express = require("express");
const router = express.Router();
const passport = require("../passport/passport");
const { addCookies } = require("../utils/addCookies");
const jwt = require("jsonwebtoken");
router.get("/user", (req, res) => {
  let token = req.signedCookies.token;
  // Check if token exists
  if (!token) {
    throw new UnauthenticatedError("Authentication Invalid,Please Log In");
  }
  // Decode token
  const user = jwt.verify(token, process.env.JWT_SECRET);
  if (user) {
    res
      .status(200)
      .json({ success: true, msg: "Login successful", user: user });
  } else {
    res.status(500).json({
      success: false,
      msg: "Seems there was an error",
    });
  }
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",

  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_LINK}/login`,
  }),
  (req, res) => {
    if (req.user) {
      addCookies({ res, user: req.user });
    }
    res.redirect(`${process.env.FRONTEND_LINK}`);
  }
);

router.route("/github").get(
  passport.authenticate("github", {
    scope: ["user:email"],
  })
);
router.route("/github/callback").get(
  passport.authenticate("github", {
    failureRedirect: `${process.env.FRONTEND_LINK}/login`,
  }),
  (req, res) => {
    if (req.user) {
      addCookies({ res, user: req.user });
    }
    res.redirect(`${process.env.FRONTEND_LINK}`);
  }
);

module.exports = router;

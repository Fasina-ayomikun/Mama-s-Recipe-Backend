const express = require("express");
const router = express.Router();
const passport = require("../passport/passport");
const { addCookies } = require("../utils/addCookies");

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
    console.log("google", req.user);
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
    res.redirect(`${process.env.FRONTEND_LINK}`);
  }
);

router.get("/user", (req, res) => {
  console.log(req.user);
  if (req.user) {
    addCookies({ res, user: req.user });

    res
      .status(200)
      .json({ success: true, msg: "Login successful", user: req.user });
  } else {
    res.status(403).json({ success: false, msg: "Seems there was an error" });
  }
});

module.exports = router;

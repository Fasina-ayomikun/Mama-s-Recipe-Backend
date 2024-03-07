const express = require("express");
const router = express.Router();
const passport = require("../passport/passport");
const { addCookies } = require("../utils/addCookies");
const middleware = (req, res, next) => {
  passport.authenticate(
    "google",
    { scope: ["profile", "email"] },
    (err, user, info) => {
      if (err || !user || info) {
        // Handle errors or invalid authentication
        return next("Error Auth");
      }

      // Log in the user
      req.logIn(user, (error) => {
        if (error) {
          return next("Error Auth");
        }
        // Continue to the next middleware
        return next();
      });
    }
  )(req, res, next); // Pass req, res, and next to the Passport middleware
};

router.get(
  "/google",
  // passport.authenticate("google", )
  middleware,
  (req, res) => {}
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
  const user = req.user;
  console.log("user", user);
  if (user) {
    addCookies({ res, user: user });

    res
      .status(200)
      .json({ success: true, msg: "Login successful", user: user });
  } else {
    res.status(403).json({ success: false, msg: "Seems there was an error" });
  }
});

module.exports = router;

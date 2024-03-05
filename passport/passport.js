require("dotenv").config();
const passport = require("passport");
const User = require("../models/User");
const { fileUploader } = require("../utils/fileHandler");
const cloudinary = require("cloudinary").v2;
// const User = require("../model/User");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;

passport.serializeUser(function (user, next) {
  next(null, user.id);
});
passport.deserializeUser(function (id, next) {
  User.findById(id, function (err, user) {
    next(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, next) => {
      try {
        const user = await User.findOne({ email: profile._json.email });
        if (user) {
          next(null, user);
        } else {
          const { given_name, family_name, picture, email, name } =
            profile._json;
          const result = await fileUploader(picture);
          const newUser = await User.create({
            firstName: given_name,
            lastName: family_name,
            displayName: name,
            loggedInWithOAuth: true,
            profileImage: { id: result.public_id, url: result.secure_url },
            email,
          });
          next(null, newUser);
        }
      } catch (error) {
        next(error);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"],
    },
    //TODO: Fixe this null email
    async function (accessToken, refreshToken, profile, next) {
      try {
        const user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          next(null, user);
        } else {
          const { _json } = profile;

          const result = await fileUploader(_json.avatar_url);
          const user = await User.create({
            firstName: _json.name.split(" ")[1],
            lastName: _json.name.split(" ")[0],
            displayName: _json.name,
            email: profile.emails[0].value,
            loggedInWithOAuth: true,
            profileImage: { id: result.public_id, url: result.secure_url },
          });
          next(null, user);
        }
      } catch (error) {
        next(error);
      }
    }
  )
);
module.exports = passport;

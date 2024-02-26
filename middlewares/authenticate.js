require("dotenv").config();
const UnauthenticatedError = require("../errors/unauthenticated");
const jwt = require("jsonwebtoken");
const checkError = require("../utils/checkError");
const authenticateUser = (req, res, next) => {
  // Get token from cookies
  let token = req.signedCookies.token;
  // Check if token exists
  if (!token) {
    throw new UnauthenticatedError("Authentication Invalid,Please Log In");
  }
  // Decode token
  const { email, userId, role, loggedInWithOAuth } = jwt.verify(
    token,
    process.env.JWT_SECRET
  );
  req.user = { email, userId, role, loggedInWithOAuth };
  next();
};
const checkRolesPermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthenticatedError("Unauthorized to access this route");
    }
    next();
  };
};
module.exports = {
  authenticateUser,
  checkRolesPermission,
};

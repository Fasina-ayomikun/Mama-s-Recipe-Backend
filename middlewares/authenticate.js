require("dotenv").config();
const UnauthenticatedError = require("../errors/unauthenticated");
const jwt = require("jsonwebtoken");
const checkError = require("../utils/checkError");
const authenticateUser = (req, res, next) => {
  try {
    // Get token from cookies
    let token = req.signedCookies.token;
    // Check if token exists
    if (!token) {
      throw new UnauthenticatedError("Authentication Invalid,Please Log In");
    }
    // Decode token
    const { email, userId } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { email, userId };
    next();
  } catch (error) {
    checkError(res, error);
  }
};

module.exports = {
  authenticateUser,
};

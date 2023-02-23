require("dotenv").config();
const jwt = require("jsonwebtoken");
const createToken = (user) => {
  const token = jwt.sign(
    { email: user.email, userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
  return token;
};
module.exports = createToken;

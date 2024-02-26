require("dotenv").config();

const addCookies = ({ res, user }) => {
  const token = user.generateJWTToken(user);
  const maxAge = 60 * 60 * 1000 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + maxAge),
    signed: true,
    sameSite: "None",
  });
};
module.exports = {
  addCookies,
};

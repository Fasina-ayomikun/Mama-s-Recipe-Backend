require("dotenv").config();
const createToken = require("./createToken");

const addCookies = ({ res, user }) => {
  const token = createToken(user);
  const maxAge = 60 * 60 * 1000 * 24;
  res.cookie("token", token, {
    httpOnly:true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() +  maxAge),
    signed: true
  });
};
module.exports = {
  addCookies,
};

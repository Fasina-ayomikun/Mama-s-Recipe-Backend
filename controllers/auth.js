const BadRequestError = require("../errors/bad-request");
const User = require("../models/User");
const NotFoundError = require("../errors/not-found");
const { addCookies } = require("../utils/addCookies");
const { fileUploader } = require("../utils/fileHandler");
const UnauthenticatedError = require("../errors/unauthenticated");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Token = require("../models/Token");
const { sendMail } = require("../utils/sendMail");
const register = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    password2,
    displayName,
    bio,
    role,
  } = req.body;
  if (!firstName || !lastName || !email || !password || !password2) {
    throw new BadRequestError("Please provide all credentials");
  }
  let result;

  // Check if Passwords Match
  if (password !== password2) {
    throw new BadRequestError("Passwords do not match");
  }

  // Check if user already exists
  const user = await User.findOne({ email });
  const newData = { ...req.body };
  if (user) {
    throw new BadRequestError("User already exists");
  }
  if (req.files) {
    const file = req.files.profileImage;
    if (file.length > 1) {
      throw new BadRequestError("Please upload only one image");
    }
    if (!file.mimetype.startsWith("image")) {
      throw new BadRequestError("Please upload an image");
    }
    const maxSize = process.env.IMAGE_MAX_SIZE;
    if (file.size > maxSize) {
      throw new BadRequestError("Please upload an image smaller than 20MB");
    }

    result = await fileUploader(file.tempFilePath);
    newData.profileImage = { id: result.public_id, url: result.secure_url };
  }
  const newUser = await User.create(newData);

  //  Create Token and Add to cookie
  newUser.password = undefined; //prevent password from displaying
  addCookies({ res, user: newUser });

  res.status(201).json({
    success: true,
    msg: "User successfully created",
    user: newUser,
  });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide all credentials");
  }
  // Check if user exist
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("User does not exist");
  }
  if (user.loggedInWithOAuth) {
    throw new BadRequestError("Seems this user logs in using Google or Github");
  }
  // Compare password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new BadRequestError("Incorrect Password");
  }
  addCookies({ res, user });
  user.password = undefined;
  res.status(200).json({
    success: true,
    msg: "User successfully logged in",
    user,
  });
};

const logout = async (req, res, next) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now()),
    signed: true,
    sameSite: "None",
  });
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  res.status(200).json({ success: true, msg: "User successfully logged out" });
};
const forgotPasswordRequestController = async (req, res) => {
  const { email } = req.body;
  const userExists = await User.findOne({ email });
  if (!userExists) {
    throw new UnauthenticatedError("Unauthorized to access this route");
  }
  const forgotPasswordToken = crypto.randomBytes(20).toString("hex");
  const encryptedToken = crypto
    .createHash("sha256")
    .update(forgotPasswordToken)
    .digest("hex");
  const createdToken = await Token.create({
    userId: userExists._id,
    token: encryptedToken,
  });
  const Url = `${process.env.FRONTEND_LINK}/forgot-password/reset?token=${forgotPasswordToken}`;
  const options = {
    from: '"Fasina Ayomikun 👻" <ayomikunfasina@gmail.com>', // sender address

    to: email,
    subject: "Mama's Recipe Password Reset",

    html: `
    <h1>Reset password by clicking the button below</h1>
    <button>
    <a href=${Url}>Reset Password</a>
    </button>`,
  };
  try {
    await sendMail({ options });

    res.status(201).json({
      success: true,
      msg: "message sent successfully",
      token: forgotPasswordToken,
    });
  } catch (error) {
    await Token.findByIdAndDelete(createdToken._id);
    throw new BadRequestError("An error occurred when sending an email");
  }
};
const forgotPasswordController = async (req, res) => {
  const { token } = req.params;
  const { password, password2 } = req.body;

  const encryptedPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const tokenExists = await Token.findOne({
    token: encryptedPasswordToken,
    tokenExpirationDate: { $gt: Date.now() },
  });
  if (!tokenExists) {
    throw new BadRequestError("Seems token has expired");
  }
  const user = await User.findById(tokenExists.userId);
  if (!user) {
    throw new BadRequestError("User does not exist");
  }
  if (password !== password2) {
    throw new BadRequestError("Passwords do not match");
  }
  user.password = password;
  await user.save();

  await Token.findByIdAndDelete(tokenExists._id);
  user.password = undefined;
  addCookies({ res, user });
  res.status(200).json({ success: true, msg: "Password reset successful" });
};
module.exports = {
  register,
  login,
  logout,
  forgotPasswordRequestController,
  forgotPasswordController,
};

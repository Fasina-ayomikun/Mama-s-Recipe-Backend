const BadRequestError = require("../errors/bad-request");
const NotFoundError = require("../errors/not-found");
const checkError = require("../utils/checkError");
const cloudinary = require("cloudinary").v2;
const checkPermission = require("../utils/checkPermission");
const User = require("../models/User");
const { imageUploader } = require("../utils/imageHandler");
const { addCookies } = require("../utils/addCookies");
const updateUserDetails = async (req, res) => {
  const { id: userId } = req.params;

  const user = await User.findOne({ _id: userId });
  // Check if User exists
  if (!user) {
    throw new NotFoundError(`No user with id: ${userId}`);
  }
  if (req.body.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      throw new BadRequestError("User already exists");
    }
  }
  let result;
  let newData = { ...req.body };
  if (req.files) {
    const file = req.files.profileImage;
    if (file.length > 1) {
      throw new BadRequestError("Please upload one image");
    }
    if (file.mimetype.startsWith("image ")) {
      throw new BadRequestError("Please upload an image");
    }
    const maxSize = process.env.IMAGE_MAX_SIZE;
    if (file.size > maxSize) {
      throw new BadRequestError("Please upload an image smaller than 20MB");
    }
    await cloudinary.uploader.destroy(user.profileImage.id);
    result = await imageUploader(file.tempFilePath);
    newData.profileImage = { id: result.public_id, url: result.secure_url };
  }
  const updatedUser = await User.findOneAndUpdate({ _id: userId }, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  console.log(updatedUser);
  addCookies({ res, user: updatedUser });
  res.status(200).json({
    success: true,
    user: updatedUser,
    msg: "User successfully updated",
  });
};
const singleUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findById({ _id: userId });

  if (!user) {
    throw new NotFoundError(`No user with id: ${userId}`);
  }

  res.status(200).json({
    success: true,
    user,
  });
};
const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.status(200).json({ success: true, users });
};
const deleteUser = async (req, res) => {
  const { id } = req.params;

  const userExists = await User.findById(id);
  if (!userExists) {
    throw new BadRequestError("User does not exist");
  }
  await userExists.deleteOne();
  res.status(200).json({
    success: true,
    msg: "user deleted successfully",
  });
};

module.exports = {
  updateUserDetails,
  singleUser,
  getAllUsers,
  deleteUser,
};

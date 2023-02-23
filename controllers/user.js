const BadRequestError = require("../errors/bad-request");
const NotFoundError = require("../errors/not-found");
const checkError = require("../utils/checkError");
const checkPermission = require("../utils/checkPermission");
const User = require("../models/User");
const updateUser = async (req, res) => {
  try {
    const { id: userId } = req.params;

    const user = await User.findOne({ _id: userId });
    // Check if user is authorized to access this route
    checkPermission(req.user.userId, user._id);
    // Check if User exists
    if (!user) {
      throw new NotFoundError(`No user with id: ${userId}`);
    }
    if (req.body.email) {
      if (req.body.email !== req.user.email) {
        throw new BadRequestError(
          "Unable to update user, Please check the email"
        );
      }
    }
    await User.updateOne({ _id: userId }, req.body);

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        displayName: user.displayName,
        bio: user.bio,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
      msg: "User successfully updated",
    });
  } catch (error) {
    checkError(res, error);
  }
};
const singleUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const user = await User.findById({ _id: userId });

    if (!user) {
      throw new NotFoundError(`No user with id: ${userId}`);
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        displayName: user.displayName,
        bio: user.bio,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    checkError(res, error);
  }
};
module.exports = {
  updateUser,
  singleUser,
};

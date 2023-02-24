const BadRequestError = require("../errors/bad-request");
const checkError = require("../utils/checkError");
const path = require("path");
const uploadImage = async (req, res) => {
  try {
    if (!req.files) {
      throw new BadRequestError("Please provide files");
    }
    const fileImage = req.files.image;
    if (fileImage.length > 1) {
      throw new BadRequestError("Please provide only one image");
    }
    // Check if file is an image
    if (!fileImage.mimetype.startsWith("image")) {
      throw new BadRequestError("Please upload an image");
    }
    const maxSize = 1024 * 1024 * 20;
    if (fileImage.size > maxSize) {
      throw new BadRequestError("Please upload an image smaller than 1MB");
    }
    const imagePath = path.join(
      __dirname,
      `../assets/images/${fileImage.name}`
    );
    await fileImage.mv(imagePath);
    res.status(200).json({
      success: true,
      msg: "Image uploaded successfully",
      image: `/assets/images/${fileImage.name}`,
    });
  } catch (error) {
    checkError(res, error);
  }
};
const uploadVideo = async (req, res) => {
  try {
    if (!req.files) {
      throw new BadRequestError("Please provide files");
    }
    const fileVideo = req.files.video;
    if (fileVideo.length > 1) {
      throw new BadRequestError("Please provide only one video");
    }
    if (!fileVideo.mimetype.startsWith("video")) {
      throw new BadRequestError("Please upload an video");
    }
    const maxSize = 100000000;
    if (fileVideo.size > maxSize) {
      throw new BadRequestError("Please upload a video smaller than 100MB");
    }
    const videoPath = path.join(
      __dirname,
      `../assets/videos/${fileVideo.name}`
    );
    await fileVideo.mv(videoPath);
    res.status(200).json({
      success: true,
      msg: "Video uploaded successfully",
      video: `/assets/videos/${fileVideo.name}`,
    });
  } catch (error) {
    checkError(res, error);
  }
};
module.exports = { uploadImage, uploadVideo };

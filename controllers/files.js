const BadRequestError = require("../errors/bad-request");
const checkError = require("../utils/checkError");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const uploadImage = async (req, res) => {
  try {
    const fileImage = req.files.image;
    if (!req.files) {
      throw new BadRequestError("Please provide files");
    }
    if (fileImage.length > 1) {
      throw new BadRequestError("Please provide only one image");
    }
    if (!fileImage.mimetype.startsWith("image")) {
      throw new BadRequestError("Please upload an image");
    }
    const maxSize = process.env.IMAGE_MAX_SIZE;
    if (fileImage.size > maxSize) {
      throw new BadRequestError("Please upload an image smaller than 20MB");
    }
    const result = await cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      {
        use_filename: true,
        folder: "Mama's-Recipe",
      }
    );
    console.log(result);
    fs.unlinkSync(req.files.image.tempFilePath);
    res.status(200).json({
      success: true,
      msg: "Image uploaded successfully",
      image: result.secure_url,
    });
  } catch (error) {
    console.log(error)
    checkError(res, error);
  }
};

module.exports = { uploadImage };

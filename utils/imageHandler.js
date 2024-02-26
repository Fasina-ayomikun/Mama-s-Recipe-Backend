const cloudinary = require("cloudinary").v2;
module.exports.imageUploader = async (file) => {
  return await cloudinary.uploader.upload(file, {
    use_filename: true,
    folder: "Mama Recipe",
    secure: true,
  });
};

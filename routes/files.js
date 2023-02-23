const express = require("express");
const { uploadVideo, uploadImage } = require("../controllers/files");
const router = express.Router();
router.route("/upload/image").post(uploadImage);
router.route("/upload/video").post(uploadVideo);

module.exports = router;

const express = require("express");
const { updateUser, singleUser } = require("../controllers/user");
const { authenticateUser } = require("../middlewares/authenticate");
const router = express.Router();
router.route("/:id").get(singleUser).patch(authenticateUser, updateUser);
module.exports = router;

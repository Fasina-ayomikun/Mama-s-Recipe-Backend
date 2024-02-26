const mongoose = require("mongoose");

const connectDB = async (url) => {
  await mongoose.connect(url);

  console.log("Mongo Connected");
};

module.exports = connectDB;

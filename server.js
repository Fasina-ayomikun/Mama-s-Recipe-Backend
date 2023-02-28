require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./db/connect");
const NotFoundMiddleWare = require("./middlewares/not-found");
const cookieParser = require("cookie-parser");
const fileUploader = require("express-fileupload");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_LINK,
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
    ],
  })
);
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(
  fileUploader({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", 'https://mama-s-recipe.vercel.app');
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/auth", require("./routes/auth"));
app.use("/users", require("./routes/user"));
app.use("/recipes", require("./routes/recipes"));
app.use("/files", require("./routes/files"));
app.use("/reviews", require("./routes/reviews"));
// MiddleWare
app.use(NotFoundMiddleWare);
mongoose.set("strictQuery", false);
const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, console.log("server is listening"));
  } catch (error) {
    console.log(error);
  }
};
start();

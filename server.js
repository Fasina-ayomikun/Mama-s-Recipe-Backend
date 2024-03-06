require("express-async-errors");
require("dotenv").config();
const express = require("express");

const expressSession = require("express-session");
const mongoose = require("mongoose");
const connectDB = require("./db/connect");
const NotFoundMiddleWare = require("./middlewares/not-found");
const { ErrorHandlerMiddleWare } = require("./middlewares/error-handler");
const cookieParser = require("cookie-parser");
const ExpressFileUploader = require("express-fileupload");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const passport = require("passport");
const swaggerUi = require("swagger-ui-express");
const app = express();
const swaggerDocument = require("./swagger.json");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(
  cors({
    origin: process.env.FRONTEND_LINK,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "PATCH", "PUT", "DELETE", "POST"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(
  ExpressFileUploader({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(
  expressSession({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://mama-s-recipe.vercel.app");
  // Add other headers as needed
  next();
});
app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/oauth", require("./routes/oauth"));
app.use("/api/v1/users", require("./routes/user"));
app.use("/api/v1/recipes", require("./routes/recipes"));
app.use("/api/v1/reviews", require("./routes/reviews"));
app.use("/api/v1/reviews/reply", require("./routes/reply"));
app.use("/api/v1/payment", require("./routes/payment"));
// MiddleWare
app.use(ErrorHandlerMiddleWare);
app.use(NotFoundMiddleWare);
mongoose.set("strictQuery", false);
const PORT = process.env.PORT || 4000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, console.log("server is listening"));
  } catch (error) {
    console.log(error);
  }
};
start();

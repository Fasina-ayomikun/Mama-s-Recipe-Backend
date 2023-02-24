require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./db/connect");
const NotFoundMiddleWare = require("./middlewares/not-found");
const cookieParser = require("cookie-parser");
const fileUploader = require("express-fileupload");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUploader());
app.use("/assets", express.static("assets"));

app.use(
  cors()
);
app.post("/", (req, res) => {
  res.json({ msg: "msg" });
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

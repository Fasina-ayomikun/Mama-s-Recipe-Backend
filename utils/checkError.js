const checkError = (res, error) => {
  console.log(error,error.message)
  let customError = {
    msg: error.message || "Something went wrong",
    status: error.status || 500,
  };
  if (error.name === "CastError") {
    customError.msg = `No item with the id ${
      error.value._id ? error.value._id : error.value
    }`;
    customError.status = 404;
  }
  if (error.name === "ValidationError") {
    customError.msg = Object.values(error.errors).map((item) => item.message);
    customError.status = 400;
  }

  if (error.name === "TokenExpiredError") {
    res.cookie("token", "logout", {
      httpsOnly: true,
      expires: new Date(Date.now()),
    });
  }
  return res.status(customError.status).json({ msg: customError.msg });
};

module.exports = checkError;

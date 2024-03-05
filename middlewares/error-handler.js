module.exports.ErrorHandlerMiddleWare = (err, req, res, next) => {
  let errorInfo = {
    status: err.status || 500,
    message: err.message || "Something went wrong",
  };
  if (err.name === "ValidationError") {
    const errorsMessages = Object.values(err.errors)
      .map((error) => {
        if (error.name === "CastError") {
          return `${error.path} expected a ${error.kind} but got a ${error.valueType} of ${error.value}
`;
        }
        return error.properties.message;
      })
      .join(", ");
    errorInfo.message = errorsMessages;
    errorInfo.status = 400;
  }
  if (err.code === 11000) {
    const keyList = Object.keys(err.keyPattern).join(", ");
    errorInfo.message = `${keyList} has duplicate value${
      keyList.length > 1 ? "s" : ""
    }`;
    errorInfo.status = 400;
  }
  if (err.name === "CastError") {
    errorInfo.message = `${err.value} not found`;
    errorInfo.status = 404;
  }

  if (err.name === "TokenExpiredError") {
    res.cookie("token", "logout", {
      httpsOnly: true,
      expires: new Date(Date.now()),
    });
  }
  res.status(errorInfo.status).json({
    success: false,

    error: {
      msg: errorInfo.message,
    },
  });
  next();
};

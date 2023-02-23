const CustomError = require("./custom-error");

class UnauthenticatedError extends CustomError {
  constructor(message) {
    super(message);
    this.status = 401;
  }
}
module.exports = UnauthenticatedError;

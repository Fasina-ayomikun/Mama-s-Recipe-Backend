const CustomError = require("./custom-error");

class NotFoundError extends CustomError {
  constructor(message, status) {
    super(message);
    this.status = 404;
  }
}
module.exports = NotFoundError;

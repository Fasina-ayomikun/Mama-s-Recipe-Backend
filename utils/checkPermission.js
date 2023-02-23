const UnauthenticatedError = require("../errors/unauthenticated");

const checkPermission = (userId, productUserId) => {
  if (userId !== productUserId.toString()) {
    throw new UnauthenticatedError("Unauthorized to access this route");
  }
};
module.exports = checkPermission;

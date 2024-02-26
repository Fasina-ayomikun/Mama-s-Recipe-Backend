const UnauthenticatedError = require("../errors/unauthenticated");

const checkPermission = (userId, incomingUserId) => {
  if (userId !== incomingUserId.toString()) {
    throw new UnauthenticatedError("Unauthorized to access this route");
  }
};
module.exports = checkPermission;

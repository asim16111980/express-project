import appError from "../utils/appError.js";
import httpStatusText from "../utils/httpStatusText.js";

const allowedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      const error = appError.create(
        "Unauthorized: You do not have permission to perform this action.",
        403,
        httpStatusText.FAIL
      );
      return next(error);
    }
    next();
  };
};

export default allowedTo;

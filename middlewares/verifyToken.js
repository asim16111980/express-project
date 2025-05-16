import jwt from "jsonwebtoken";
import appError from "../utils/appError.js";
import httpStatus from "../utils/httpStatusText.js";

const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];

  if (!authHeader) {
    const error = appError.create(
      "Access denied. No token provided.",
      401,
      httpStatus.ERROR
    );
    return next(error);
  }

  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    next();
  } catch (err) {
    const error = appError.create(
      "Invalid or expired token.",
      401,
      httpStatus.ERROR
    );
    return next(error);
  }
};

export default verifyToken;

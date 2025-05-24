import express from "express";
import * as usersController from "../controllers/users.controller.js";
import { userValidation } from "../middlewares/validationSchema.js";
import verifyToken from "../middlewares/verifyToken.js";
import multer from "multer";
import appError from "../utils/appError.js";
import httpStatusText from "../utils/httpStatusText.js";

const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split("/")[0];
  if (imageType === "image") {
    return cb(null, true);
  } else {
    const error = appError.create(
      "Only image files are allowed!",
      400,
      httpStatusText.FAIL
    );
    cb(error, false);
  }
};

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const fileName = `user-${Date.now()}.${ext}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage: diskStorage, fileFilter });

const router = express.Router();

router.route("/").get(verifyToken, usersController.getAllUsers);

router
  .route("/register")
  .post(upload.single("avatar"), usersController.register);

router.route("/login").post(userValidation(), usersController.login);

export default router;

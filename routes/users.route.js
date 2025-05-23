import express from "express";
import * as usersController from "../controllers/users.controller.js";
import { userValidation } from "../middlewares/validationSchema.js";
import verifyToken from "../middlewares/verifyToken.js";
import multer from "multer";

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
const upload = multer({ storage: diskStorage });
const router = express.Router();

router.route("/").get(verifyToken, usersController.getAllUsers);

router
  .route("/register")
  .post(upload.single("avatar"), usersController.register);

router.route("/login").post(userValidation(), usersController.login);

export default router;

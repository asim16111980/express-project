import express from "express";
import * as usersController from "../controllers/users.controller.js";
import { userValidation } from "../middlewares/validationSchema.js";
import verifyToken from "../middlewares/verifyToken.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.route("/").get(verifyToken, usersController.getAllUsers);

router.route("/register").post(usersController.register);

router.route("/login").post(userValidation(), usersController.login);

export default router;

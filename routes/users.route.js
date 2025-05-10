import express from "express";
import * as usersController from "../controllers/users.controller.js";
import { userValidation } from "../middlewares/validationSchema.js";

const router = express.Router();

router.route("/").get(usersController.getAllUsers);

router.route("/register").post(usersController.register);

router.route("/login").post(userValidation(), usersController.login);

export default router;

import user from "../models/user.model.js";
import { validationResult } from "express-validator";
import httpStatusText from "../utils/httpStatusText.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import appError from "../utils/appError.js";
import { bcrypt } from "bcryptjs";

const getAllUsers = asyncWrapper(async (req, res, next) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  const users = await userModel
    .find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);
  res.json({ status: httpStatusText.SUCCESS, data: { users } });
});

const register = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  const foundUser = await userModel.findOne({
    email: email,
  });
  if (foundUser) {
    const error = appError.create(
      "This email is already registered. Please use a different email or log in instead.",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const hashedPassword = await bcrypt.hash(password);
  const newUser = new user({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });
  await newUser.save();
  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { user: newUser } });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  }

  const foundUser = await userModel.findOne({ email: email });
  if (!foundUser) {
    const error = appError.create(
      "Invalid email or password. Please try again.",
      401,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const isPasswordValid = await bcrypt.compare(password, foundUser.password);
  if (!isPasswordValid) {
    const error = appError.create(
      "Invalid email or password. Please try again.",
      401,
      httpStatusText.FAIL
    );
    return next(error);
  }

  res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { user: foundUser } });
});

export { getAllUsers, register, login };

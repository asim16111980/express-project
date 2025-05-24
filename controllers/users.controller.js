import User from "../models/user.model.js";
import { validationResult } from "express-validator";
import httpStatusText from "../utils/httpStatusText.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import appError from "../utils/appError.js";
import bcrypt from "bcryptjs";
import generateJWT from "../utils/generateJWT.js";

const getAllUsers = asyncWrapper(async (req, res, next) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  const users = await User.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);
  res.json({ status: httpStatusText.SUCCESS, data: { users } });
});

const register = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;
  const foundUser = await User.findOne({
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

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar: req.file.filename,
  });

  const token = generateJWT(
    { email: newUser.email, id: newUser._id, role: newUser.role },
    "1m"
  );

  newUser.token = token;
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

  const foundUser = await User.findOne({ email: email });
  if (!foundUser) {
    const error = appError.create(
      "User not found. Please make sure the email is correct or register first.",
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const isPasswordValid = await bcrypt.compare(password, foundUser.password);
  if (!isPasswordValid) {
    const error = appError.create(
      "Incorrect password. Please try again.",
      401,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const token = generateJWT(
    { email: foundUser.email, id: foundUser._id, role: foundUser.role },
    "1m"
  );

  res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { token: token } });
});

export { getAllUsers, register, login };

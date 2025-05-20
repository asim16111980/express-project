import mongoose from "mongoose";
import validator from "validator";
import userRoles from "../utils/userRoles.js";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [
      validator.isEmail,
      "Invalid email address. Please enter a valid email.",
    ],
  },
  password: {
    type: String,
    required: true,
  },
  token: { type: String },
  role: {
    type: String,
    enum: [userRoles.ADMIN, userRoles.MANAGER, userRoles.USER],
    default: userRoles.USER,
  },
});

const userModel = mongoose.model("User", userSchema);

export default userModel;

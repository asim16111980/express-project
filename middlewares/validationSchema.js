import { body } from "express-validator";

const productValidation = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 2 })
      .withMessage("Title at least is 2 digits"),
    body("price").notEmpty().withMessage("Price is required"),
  ];
};

const userValidation = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is not valid"),
    body("password").notEmpty().withMessage("Password is required"),
  ];
};

export { productValidation, userValidation };

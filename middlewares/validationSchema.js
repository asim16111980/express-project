import { body } from "express-validator";

const productValidation = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("Title is require")
      .isLength({ min: 2 })
      .withMessage("Title at least is 2 digits"),
    body("price").notEmpty().withMessage("Price is require"),
  ];
};

export { productValidation };
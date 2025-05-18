import express from "express";
import * as productsController from "../controllers/products.controller.js";
import { productValidation } from "../middlewares/validationSchema.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router
  .route("/")
  .get(productsController.getAllProducts)
  .post(productValidation(), productsController.addProduct);

router
  .route("/:id")
  .get(verifyToken,productsController.getProduct)
  .patch(productsController.updateProduct)
  .delete(productsController.deleteProduct);

export default router;

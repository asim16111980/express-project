import express from "express";
import * as productsController from "../controllers/products.controller.js";
import { productValidation } from "../middlewares/validationSchema.js";
import verifyToken from "../middlewares/verifyToken.js";
import allowedTo from "../middlewares/allowedTo.js";
import userRoles from "../utils/userRoles.js";

const router = express.Router();

router
  .route("/")
  .get(productsController.getAllProducts)
  .post(
    verifyToken,
    allowedTo(userRoles.MANAGER),
    productValidation(),
    productsController.addProduct
  );

router
  .route("/:id")
  .get(verifyToken, productsController.getProduct)
  .patch(productsController.updateProduct)
  .delete(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.MANAGER),
    productsController.deleteProduct
  );

export default router;

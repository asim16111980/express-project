import productModel from "../models/product.model.js";
import { validationResult } from "express-validator";
import httpStatusText from "../utils/httpStatusText.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import appError from "../utils/appError.js";

const getAllProducts = asyncWrapper(async (req, res, next) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  const products = await productModel
    .find({}, { __v: false })
    .limit(limit)
    .skip(skip);
  res.json({ status: httpStatusText.SUCCESS, data: { products } });
});

const getProduct = asyncWrapper(async (req, res, next) => {
  const productId = req.params.id;
  const product = await productModel.findById(productId);
  if (!product) {
    const error = appError.create(
      `Product with ID ${productId} not found.`,
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }
  res.json({ status: httpStatusText.SUCCESS, data: { product } });
});

const addProduct = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  }

  const newProduct = new productModel(req.body);
  await newProduct.save();
  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { product: newProduct } });
});

const updateProduct = asyncWrapper(async (req, res, next) => {
  const productId = req.params.id;

  const updatedProduct = await productModel.updateOne(
    { _id: productId },
    {
      $set: { ...req.body },
    }
  );
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { product: updatedProduct },
  });
});

const deleteProduct = asyncWrapper(async (req, res, next) => {
  const productId = req.params.id;
  await productModel.deleteOne({ _id: productId });
  res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
});

export { getAllProducts, getProduct, addProduct, updateProduct, deleteProduct };

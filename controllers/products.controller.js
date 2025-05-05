import productModel from "../models/products.model.js";
import { validationResult } from "express-validator";
import httpStatusText from "../utils/httpStatusText.js";

const getAllProducts = async (req, res) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  const products = await productModel
    .find({}, { __v: false })
    .limit(limit)
    .skip(skip);
  res.json({ status: httpStatusText.SUCCESS, data: { products } });
};

const getProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await productModel.findById(productId);
    if (!product)
      return res.status(404).json({
        status: httpStatusText.FAIL,
        data: { product: null },
      });
    res.json({ status: httpStatusText.SUCCESS, data: { product } });
  } catch (err) {
    res.status(400).json({
      status: httpStatusText.ERROR,
      data: null,
      message: err.message,
      code: 400,
    });
  }
};

const addProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res
      .status(400)
      .json({ status: httpStatusText.FAIL, data: errors.array() });

  const newProduct = new productModel(req.body);

  await newProduct.save();

  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { product: newProduct } });
};

const updateProduct = async (req, res) => {
  const productId = req.params.id;
  try {
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
  } catch (err) {
    res.status(400).json({
      status: httpStatusText.ERROR,
      data: null,
      message: err.message,
      code: 400,
    });
  }
};

const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  await productModel.deleteOne({ _id: productId });
  res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
};

export { getAllProducts, getProduct, addProduct, updateProduct, deleteProduct };

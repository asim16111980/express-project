import express from "express";
import productModel from "../models/products.model.js";
import { validationResult } from "express-validator";

const getAllProducts = async (req, res) => {
  const products = await productModel.find();
  res.json(products);
};

const getProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ msg: "Product is not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

const addProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json(errors.array());

  const newProduct = new productModel(req.body);

  await newProduct.save();

  res.status(201).json(newProduct);
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
    res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ msg: "Server error" });
  }
};

const deleteProduct = async (req, res) => {
  const productId = req.params.id;
   await productModel.deleteOne({_id:productId});
  res.status(200).json({ success: true, msg: "Product deleted successfully" });
};

export { getAllProducts, getProduct, addProduct, updateProduct, deleteProduct };

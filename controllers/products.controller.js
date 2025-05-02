import express from "express";
import productModel from "../models/products.model";
import { validationResult } from "express-validator";

const getAllProducts = async (req, res) => {
  const products = await productModel.find();
  res.json(products);
};

const getProduct = async (req, res) => {
  const productId = req.params.id;

  const product = await productModel.findById(productId);

  if (!product) return res.status(404).json({ msg: "Product is not found" });

  res.json(product);
};

const addProduct =  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    res.status(201).json()
}
  
// const updateProduct = (req, res) => {
//     const productId = req.param.id;

//     const product=
//     // if(!product)
// }

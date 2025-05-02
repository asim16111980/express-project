import express from "express";
import mongoose from "mongoose";
import { body, validationResult } from "express-validator";

const app = express();
app.use(express.json());

const url =
  "mongodb+srv://abomido1012014:me01098456961@learn-mongo-db.ygqwqya.mongodb.net/learning-mongo-db?retryWrites=true&w=majority&appName=learn-mongo-db";

const main = async () => {
  await mongoose.connect(url);
  console.log("Mserver started");
};

app.get("/", (req, res) => {});

app.post(
  "/products",
  [
    body("title")
      .notEmpty()
      .withMessage("Title is require")
      .isLength({ mni: 2 })
      .withMessage("Title at least is 2 digits"),
    body("price").notEmpty().withMessage("Price is require"),
  ],
 
);

main();

app.listen("3000", () => {
  console.log("server is starting");
});

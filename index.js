import express from "express";
import mongoose from "mongoose";
import productsRouter from "./routes/products.route.js";

const app = express();
app.use(express.json());
app.use("/api/products", productsRouter);

const url =
  "mongodb+srv://abomido1012014:me01098456961@learn-mongo-db.ygqwqya.mongodb.net/learning-mongo-db?retryWrites=true&w=majority&appName=learn-mongo-db";

const main = async () => {
  await mongoose.connect(url);
  console.log("Mserver started");
};

main();

app.listen("3000", () => {
  console.log("server is starting");
});

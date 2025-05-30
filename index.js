import express from "express";
import mongoose from "mongoose";
import productsRouter from "./routes/products.route.js";
import usersRouter from "./routes/users.route.js";
import "dotenv/config";
import httpStatusText from "./utils/httpStatusText.js";
import cors from "cors";
import path from "node:path";

const app = express();
// app.use("/uploads", express.static(path.join(import.meta.dirname, "/uploads")));
app.use(cors());
app.use(express.json());
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);
app.all("*any-route", (req, res) => {
  return res.status(404).json({
    status: httpStatusText.ERROR,
    message: "This resource is not available",
  });
});
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.statusText || httpStatusText.ERROR,
    message: err.message,
    code: err.statusCode || 500,
    data: null,
  });
});

const url = process.env.MONGO_URL;
const port = process.env.PORT || 3000;

const main = async () => {
  await mongoose.connect(url);
  console.log("Mongo-db server started");
};

main();

app.listen(port, () => {
  console.log("Listening on port:", port);
});

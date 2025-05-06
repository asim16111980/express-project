import express from "express";
import mongoose from "mongoose";
import productsRouter from "./routes/products.route.js";
import "dotenv/config";
import httpStatusText from "./utils/httpStatusText.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/products", productsRouter);
app.all("*any-route", (req, res) => {
  return res.status(404).json({
    status: httpStatusText.ERROR,
    message: "This resource is not available",
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

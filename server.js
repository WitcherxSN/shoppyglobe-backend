const Cart = require("./models/Cart");
const Product = require("./models/Product");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("ShoppyGlobe API is running");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

  app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products"
    });
  }
});

app.get("/products/:id", async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json(product);

  } catch (error) {
    res.status(400).json({
      message: "Invalid product ID"
    });
  }
});

app.post("/cart", async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    const cartItem = new Cart({
      productId: productId,
      quantity: quantity
    });

    await cartItem.save();

    res.status(201).json({
      message: "Product added to cart",
      cartItem: cartItem
    });

  } catch (error) {
    res.status(400).json({
      message: "Invalid data"
    });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
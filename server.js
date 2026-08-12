const Cart = require("./models/Cart");
const Product = require("./models/Product");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/auth");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("ShoppyGlobe API is running");
});

// Connect application to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

  // Fetch all products from MongoDB
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

// Fetch a single product using MongoDB ID
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

// Add product to cart (protected route)
app.post("/cart", authMiddleware, async (req, res) => {
  try {

    const { productId, quantity } = req.body;

if (!productId || !quantity) {
  return res.status(400).json({
    message: "Product ID and quantity are required"
  });
}
    

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

// Update cart item quantity (protected route)
app.put("/cart/:id", authMiddleware, async (req, res) => {
  try {
    const { quantity } = req.body;

    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found"
      });
    }

    cartItem.quantity = quantity;

    await cartItem.save();

    res.status(200).json({
      message: "Cart updated successfully",
      cartItem: cartItem
    });

  } catch (error) {
    res.status(400).json({
      message: "Invalid data"
    });
  }
});

// Delete item from cart (protected route)
app.delete("/cart/:id", authMiddleware, async (req, res) => {
  try {
    const cartItem = await Cart.findByIdAndDelete(req.params.id);

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found"
      });
    }

    res.status(200).json({
      message: "Cart item deleted successfully"
    });

  } catch (error) {
    res.status(400).json({
      message: "Invalid cart item ID"
    });
  }
});

// Register a new user and store hashed password
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Registration failed"
    });
  }
});

// Login user and generate JWT token
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Compare entered password with hashed password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token: token
    });

  } catch (error) {
    res.status(500).json({
      message: "Login failed"
    });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../Controller/ProductController.js"; // Note: Add .js to the file extension

const router = express.Router();

// Create a new product
router.post("/products", createProduct);

// Get all products
router.get("/products", getAllProducts);

// Get a product by ID
router.get("/products/:id", getProductById);

// Update a product by ID
router.put("/products/:id", updateProduct);

// Delete a product by ID
router.delete("/products/:id", deleteProduct);

export default router;

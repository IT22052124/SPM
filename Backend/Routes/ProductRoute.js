import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getRecommendedProducts,
  getProductByBarcode,
  getAllBarcodes,
} from "../Controller/ProductController.js"; // Note: Add .js to the file extension
import { get } from "mongoose";

const router = express.Router();

// Create a new product
router.post("/products", createProduct);

// Get all products
router.get("/products", getAllProducts);

// Get a product by ID
router.get("/product/:Barcode", getProductByBarcode);

router.get("/barcodes", getAllBarcodes);

// Get a product by Barcode
router.get("/products/:id", getProductById);

// Update a product by ID
router.put("/products/:id", updateProduct);

// Delete a product by ID
router.delete("/products/:id", deleteProduct);

router.get("/recommendation", getRecommendedProducts);

export default router;

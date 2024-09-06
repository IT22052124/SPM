import express from "express";
import {
  createPromotion,
  getAllPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion,
} from "../Controller/PromotionController.js"; // Change to PromotionController.js

const router = express.Router();

// Create a new promotion
router.post("/promotions", createPromotion);

// Get all promotions
router.get("/promotions", getAllPromotions);

// Get a promotion by ID
router.get("/promotions/:id", getPromotionById);

// Update a promotion by ID
router.put("/promotions/:id", updatePromotion);

// Delete a promotion by ID
router.delete("/promotions/:id", deletePromotion);

export default router;

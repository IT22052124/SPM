import express from "express";
import {
  createLoyaltyCustomer,
  getAllLoyaltyCustomers,
  getLoyaltyCustomerById,
  updateLoyaltyCustomer,
  deleteLoyaltyCustomer,
} from "../Controller/LoyaltyController.js"; // Change to LoyaltyController.js

const router = express.Router();

// Create a new loyalty customer
router.post("/loyalty-customers", createLoyaltyCustomer);

// Get all loyalty customers
router.get("/loyalty-customers", getAllLoyaltyCustomers);

// Get a loyalty customer by ID
router.get("/loyalty-customers/:id", getLoyaltyCustomerById);

// Update a loyalty customer by ID
router.put("/loyalty-customers/:id", updateLoyaltyCustomer);

// Delete a loyalty customer by ID
router.delete("/loyalty-customers/:id", deleteLoyaltyCustomer);

export default router;

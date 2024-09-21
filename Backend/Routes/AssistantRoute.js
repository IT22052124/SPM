import express from "express";
import {
    createAssistant,
    getAllAssistants,
    getAssistantByEmployeeId,
    updateAssistantByEmployeeId,
    deleteAssistantByEmployeeId,
} from "../Controller/Assistant-controller.js"; // Change to LoyaltyController.js

const router = express.Router();

// Create a new loyalty customer
router.post("/", createAssistant);

// Get all loyalty customers
router.get("/", getAllAssistants);

// Get a loyalty customer by ID
router.get("/:id", getAssistantByEmployeeId);

// Update a loyalty customer by ID
router.put("/:id", updateAssistantByEmployeeId);

// Delete a loyalty customer by ID
router.delete("/:id", deleteAssistantByEmployeeId);

export default router;

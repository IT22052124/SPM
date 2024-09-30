import express from "express";
import {
    createUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
} from "../Controller/User-Controller.js"; // Make sure this file exists with the appropriate functions

const router = express.Router();

// Create a new user
router.post("/", createUser);

// Get all users
router.get("/", getAllUsers);

// Get a user by ID
router.get("/:id", getUserById);

// Update a user by ID
router.put("/:id", updateUserById);

// Delete a user by ID
router.delete("/:id", deleteUserById);



export default router;

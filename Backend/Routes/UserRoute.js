import express from "express";
import {
    createUser,
    getAllUsers,
    getUserByEmail,
    updateUserByEmail,
    deleteUserById,
    uploadProfilePicture,
    updateProfilePicture
} from "../Controller/User-Controller.js"; // Make sure this file exists with the appropriate functions

const router = express.Router();

// Create a new user
router.post("/", createUser);

// Get all users
router.get("/", getAllUsers);

// Get a user by ID
router.get("/:email", getUserByEmail);

// Update a user by ID
router.put("/:email", updateUserByEmail);

// Delete a user by ID
router.delete("/:id", deleteUserById);

router.post("/upload-profile-picture", uploadProfilePicture, updateProfilePicture);

export default router;

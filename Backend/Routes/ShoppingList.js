import express from "express";
const router = express.Router();
import {
  createShoppingList,
  addItemToShoppingList,
  getShoppingLists,
  deleteShoppingList,
  getShoppingListById,
  deleteItemFromShoppingList,
  generateMonthlyReport
} from "../Controller/ShoppingListController.js";

// Create a new shopping list
router.post("/shopping", createShoppingList);

// Add an item to an existing shopping list
router.post("/shopping-lists/:listId/items", addItemToShoppingList);

// Soft delete a shopping list
router.delete("/shopping-lists/:listId", deleteShoppingList);

// Get all shopping lists for the current user (excluding deleted lists)
router.get("/shopping-lists", getShoppingLists);

// Get a specific shopping list by ID (only if not deleted)
router.get("/shopping-lists/:listId", getShoppingListById);

// Delete an item from a shopping list
// Delete an item from a shopping list
router.delete("/shopping-lists/:listId/items/:product", deleteItemFromShoppingList);

//get all products
router.get('/shopping-lists/reports/:month/:year', generateMonthlyReport);

export default router;

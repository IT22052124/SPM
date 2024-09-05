const express = require('express');
const router = express.Router();
const shoppingListController = require('../controllers/shoppingListController');

// Create a new shopping list
router.post('/shopping-lists', shoppingListController.createShoppingList);

// Add an item to an existing shopping list
router.post('/shopping-lists/:listId/items', shoppingListController.addItemToShoppingList);

// Soft delete a shopping list
router.delete('/shopping-lists/:listId', shoppingListController.deleteShoppingList);

// Get all shopping lists for the current user (excluding deleted lists)
router.get('/shopping-lists', shoppingListController.getShoppingLists);

// Get a specific shopping list by ID (only if not deleted)
router.get('/shopping-lists/:listId', shoppingListController.getShoppingListById);

// Delete an item from a shopping list
router.delete('/shopping-lists/:listId/items', shoppingListController.deleteItemFromShoppingList);


module.exports = router;

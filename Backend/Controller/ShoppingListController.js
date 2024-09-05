const ShoppingList = require("../models/ShoppingList");
const Product = require("../models/ProductModel"); // Adjust path if necessary

// Create a new shopping list
export const createShoppingList = async (req, res) => {
  try {
    const { listname, products } = req.body;

    const newShoppingList = new ShoppingList({
      listname,
      user: req.user._id, // Assuming you're using authentication and storing the user ID in req.user
      products,
    });

    const savedShoppingList = await newShoppingList.save();

    res.status(201).json(savedShoppingList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add an item to an existing shopping list
export const addItemToShoppingList = async (req, res) => {
  try {
    const { listId } = req.params;
    const { productId, quantity, price, name, category } = req.body;

    // Find the shopping list by ID
    const shoppingList = await ShoppingList.findById(listId);

    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    // Check if product already exists in the list
    const existingProduct = shoppingList.products.find((item) =>
      item.product.equals(productId)
    );

    if (existingProduct) {
      // Update the existing product's quantity and price
      existingProduct.quantity += quantity;
      existingProduct.price = price;
      existingProduct.action = "added";
    } else {
      // Add the new product to the list
      shoppingList.products.push({
        product: productId,
        name,
        category,
        quantity,
        price,
        action: "added",
      });
    }

    // Save the updated shopping list
    await shoppingList.save();

    res.status(200).json(shoppingList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Soft delete a shopping list
export const deleteShoppingList = async (req, res) => {
  try {
    const { listId } = req.params;

    const shoppingList = await ShoppingList.findById(listId);

    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    shoppingList.isDeleted = true;
    await shoppingList.save();

    res.status(200).json({ message: "Shopping list marked as deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all shopping lists (excluding those marked as deleted)
export const getShoppingLists = async (req, res) => {
  try {
    const shoppingLists = await ShoppingList.find({
      user: req.user._id,
      isDeleted: false,
    });

    res.status(200).json(shoppingLists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an item from a shopping list
export const deleteItemFromShoppingList = async (req, res) => {
  try {
    const { listId } = req.params; // Shopping list ID
    const { productId } = req.body; // Product ID to be removed

    // Find the shopping list by ID
    const shoppingList = await ShoppingList.findById(listId);

    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    // Find the product to be removed
    const productIndex = shoppingList.products.findIndex((item) =>
      item.product.equals(productId)
    );

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: "Product not found in shopping list" });
    }

    // Remove the product from the list
    shoppingList.products.splice(productIndex, 1);

    // Save the updated shopping list
    await shoppingList.save();

    res
      .status(200)
      .json({ message: "Item removed from shopping list", shoppingList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific shopping list by ID (only if not deleted)
export const getShoppingListById = async (req, res) => {
  try {
    const { listId } = req.params;

    const shoppingList = await ShoppingList.findOne({
      _id: listId,
      isDeleted: false,
    }).populate("products.product", "name category price");

    if (!shoppingList) {
      return res
        .status(404)
        .json({ message: "Shopping list not found or has been deleted" });
    }

    res.status(200).json(shoppingList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import { ShoppingList } from "../models/ShoppingList.js";

// Create a new shopping list
export const createShoppingList = async (req, res) => {
  try {
    const { listname, email } = req.body;

    const newShoppingList = new ShoppingList({
      listname,
      email, // Store the user's email
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

    // Check if the product already exists in the list
    const existingProduct = shoppingList.products.find((item) =>
      item.product.equals(productId)
    );

    if (existingProduct) {
      // If the product was marked as "removed," change it back to "added"
      if (existingProduct.action === "removed") {
        existingProduct.action = "added";
        existingProduct.quantity = quantity; // Update quantity if needed
        existingProduct.price = price; // Update price if needed
      } else {
        // Otherwise, update the quantity and price of the existing product
        existingProduct.quantity = quantity;
        existingProduct.price = price;
      }
    } else {
      // Add the new product to the list
      shoppingList.products.push({
        product: productId,
        name: name,
        category: category,
        quantity: quantity,
        price: price,
        action: "added",
      });
    }

    // Save the updated shopping list
    await shoppingList.save();
    shoppingList.products = shoppingList.products.filter(
      (item) => item.action === "added"
    );
    res.status(200).json(shoppingList);
  } catch (error) {
    console.error("Error saving item to shopping list:", error);
    res.status(500).json("not saved");
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
    console.error("deleted:", error);
  }
};

export const getShoppingLists = async (req, res) => {
  try {
    const { email } = req.query; // Retrieve email from query params

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const shoppingLists = await ShoppingList.find({
      email: email,  // Filter by email
      isDeleted: false,
    });

    res.status(200).json(shoppingLists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete an item from a shopping list

// Controller to mark an item as removed
export const deleteItemFromShoppingList = async (req, res) => {
  const { listId, product } = req.params;

  try {
    // Find the shopping list by ID
    const shoppingList = await ShoppingList.findById(listId);

   
    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    // Find the product within the shopping list
    const itemIndex = shoppingList.products.findIndex(
      (item) => item._id.toString() === product
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in the list" });
    }

    // Update the action to "removed"
    shoppingList.products[itemIndex].action = "removed";

    // Save the updated shopping list
    await shoppingList.save();

    res
      .status(200)
      .json({ message: "Product marked as removed", shoppingList });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/// Get a specific shopping list by ID (only if not deleted)
export const getShoppingListById = async (req, res) => {
  try {
    const { listId } = req.params;

    const shoppingList = await ShoppingList.findOne({
      _id: listId,
      isDeleted: false,
    })
      .populate({
        path: "products.product", // Path to the product field within the products array
        model: "Product", // Name of the model to populate from
      })
      .lean(); // Optional: to get a plain JavaScript object instead of a Mongoose document

    console.log(shoppingList);
    if (!shoppingList) {
      return res
        .status(404)
        .json({ message: "Shopping list not found or has been deleted" });
    }

    // Filter products to only include those with `action: "added"`
    shoppingList.products = shoppingList.products.filter(
      (item) => item.action === "added"
    );

    res.status(200).json(shoppingList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Generate report of products added in a specified month
// Generate report of products added in a specified month
export const generateMonthlyReport = async (req, res) => {
  const { month, year, email } = req.params;


  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    // Assuming req.user contains user info including email
   

    // Fetch shopping lists for the user within the specified date range and populate product details
    const shoppingLists = await ShoppingList.find({
      createdAt: { $gte: startDate, $lt: endDate },
      email: email // Filter by user email
    }).populate('products.product'); // Populate the product field with details from the Product model

    // Check if no shopping lists were created in the specified date range
    if (shoppingLists.length === 0) {
      return res.status(200).json({ message: "No shopping lists created for this month.", shoppingListCount: 0 });
    }

    // Initialize an empty report object
    const report = {};

    // Loop through each shopping list
    shoppingLists.forEach((list) => {
      // Loop through each product in the list
      list.products.forEach((item) => {
        const productName = item.product.name; // Ensure you access the product name correctly
        const totalPrice = item.product?.BasePrice * item.quantity; // Calculate total price
        
        // Extract the unit for the product
        const productUnit = item.product?.Unit || 'Unknown'; 

        // If product is not already in the report, initialize it
        if (!report[productName]) {
          report[productName] = { quantity: 0, totalPrice: 0, unit: productUnit };
        }

        // Update the product's total quantity and total price in the report
        report[productName].quantity += item.quantity;
        report[productName].totalPrice += totalPrice;
      });
    });

    // Send the report along with the count of shopping lists as a response
    res.status(200).json({
      shoppingListCount: shoppingLists.length, // Total number of shopping lists
      report,
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: error.message });
  }
};

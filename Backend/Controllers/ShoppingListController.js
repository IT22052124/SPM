const ShoppingList = require('../models/ShoppingList');
const Product = require('../Model/ProductModel');

// Get shopping list with product details
const getShoppingList = async (req, res) => {
  try {
    const listId = req.params.id;
    const shoppingList = await ShoppingList.findById(listId)
      .populate({
        path: 'products.product',
        model: 'Product',
        select: 'name basePrice imageUrl' // Select only required fields
      });
    
    if (!shoppingList) {
      return res.status(404).json({ message: 'Shopping list not found' });
    }

    // Attach product price to each product item
    const listWithProductDetails = shoppingList.products.map(item => ({
      product: item.product,
      quantity: item.quantity,
      price: item.product.basePrice // Get the current price from Product model
    }));

    res.status(200).json({
      ...shoppingList.toObject(),
      products: listWithProductDetails
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getShoppingList,
};

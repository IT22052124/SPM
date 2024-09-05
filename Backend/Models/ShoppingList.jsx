const mongoose = require("mongoose");

const shoppingListSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Reference to the Product model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1, // Default quantity is 1
        },
        name: {
          type: String,
          required: true,
          default: 1, // Default quantity is 1
        },
        price: {
          type: Number,
          required: true,
          default: 1, // Default quantity is 1
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ShoppingList = mongoose.model("ShoppingList", shoppingListSchema);
module.exports = ShoppingList;

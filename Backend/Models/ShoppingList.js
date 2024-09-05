import mongoose from "mongoose";

const shoppingListSchema = mongoose.Schema(
  {
    listname: {
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
        name: {
          type: String,
          required: true,
        },
        catergory: {
          type: String,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          default: 1, // Default quantity is 1
        },

        price: {
          type: Number,
          required: true,
          default: 1, // Default quantity is 1
        },
        action: {
          type: String,
          enum: ["added", "removed"], // Track whether the product was added or removed
          required: true,
        },
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const ShoppingList = mongoose.model("ShoppingList", shoppingListSchema);

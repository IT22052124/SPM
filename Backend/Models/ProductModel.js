import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    ID: {
      type: String,
      required: [true, "Please Enter an ID"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Please Enter a Name"],
      trim: true,
    },
    Description: {
      type: String,
      required: [true, "Please Enter a Description"],
      trim: true,
    },
    BasePrice: {
      type: Number,
      required: [true, "Please Enter a Base Price"],
    },
    DiscountType: {
      type: String,
      required: false,
      trim: true,
    },
    DiscountPercentage: {
      type: Number,
      required: false,
      min: 0,
      max: 100, // Cap DiscountPercentage at 100
    },
    SKU: {
      type: String,
      required: [true, "Please Enter an SKU"],
    },
    Unit: {
      type: String,
      enum: ["Pcs", "Kg", "Liters", "Boxes", "Other"],
      required: [true, "Please Enter a Unit"],
    },
    Barcode: {
      type: String,
      required: false,
      trim: true,
    },
    Quantity: {
      type: Number,
      required: false,
    },
    Category: {
      type: String,
      required: false,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    imageUrl: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", productSchema);

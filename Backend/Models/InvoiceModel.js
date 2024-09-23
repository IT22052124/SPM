import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: String,
      required: true,
    },
    CusType: {
      type: String,
      enum: ["All", "Loyalty"],
      default: "All",
    },
    CartItems: [
      {
        pId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productId: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        unit: {
          type: String,
          required: true,
        },
        discount: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Invoice = mongoose.model("Invoice", invoiceSchema);

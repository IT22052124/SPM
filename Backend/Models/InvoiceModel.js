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
    LoyaltyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loyalty",
      required: false,
    },
    LoyaltyPhone: {
      type: String,
      required: false,
    },
    LoyaltyName: {
      type: String,
      required: false,
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
        total: {
          type: Number,
          required: true,
        },
        promoId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Promotion",
          required: false,
        },
        promoName: {
          type: String,
          required: false,
        },
        promoPercentage: {
          type: Number,
          required: false,
        },
        DiscountedTotal: {
          type: Number,
          required: true,
        },
      },
    ],
    finalTotal: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Invoice = mongoose.model("Invoice", invoiceSchema);

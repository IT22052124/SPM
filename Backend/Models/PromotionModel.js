import mongoose from "mongoose";

const PromotionSchema = mongoose.Schema(
  {
    ID: {
      type: String,
      required: true,
    },
    promotionName: {
      type: String,
      required: true,
    },
    product: {
      type: String,
      required: true,
    },
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: false,
    },
    minPurchase: {
      type: Number,
      required: false,
    },
    maxDiscount: {
      type: Number,
      required: false,
    },
    eligibility: {
      type: String,
      required: true,
      enum: ['All Customers', 'Loyalty Customers'],
    },
    discPercentage: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
        type: Date,
        required: true,
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

export const Promotion = mongoose.model("Promotion", PromotionSchema);

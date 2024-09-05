const mongoose = require("mongoose");

const LoyaltySchema = mongoose.Schema(
  {
    ID: {
      type: String,
      required: [true, "Please Enter an ID"],
      trim: true,
    },
    Phone: {
      type: Number,
      required: [true, "Please Enter a Phone"],
      trim: true,
    },
    Name: {
      type: String,
      required: [true, "Please Enter a Name"],
      trim: true,
    },
    Email: {
      type: String,
      required: [true, "Please Enter a email"],
      trim: true,
    },
    Adress: {
      type: String,
      required: [true, "Please Enter a adress"],
      trim: true,
    },
    Gender: {
      type: String,
      required: [true, "Please Enter a gender"],
      trim: true,
    },
    DOB: {
      type: Date,
      required: [true, "Please Enter a DOB"],
      trim: true,
    },
    Points: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true, 
  }
);

const Loyalty = mongoose.model("Loyalty", LoyaltySchema);
module.exports = Loyalty;

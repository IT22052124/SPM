import mongoose from "mongoose";

const LoyaltySchema = mongoose.Schema(
  {
    ID: {
      type: String,
      required: true,
    },
    Phone: {
      type: String,
      required: true,
      unique: true, // Ensures phone numbers are unique
      validate: {
        validator: function(v) {
          return /\d{10}/.test(v); // Ensures it's a valid 10-digit number
        },
        message: props => `${props.value} is not a valid phone number!`
      },
    },
    Name: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Email format validation
        },
        message: props => `${props.value} is not a valid email!`
      },
    },
    Address: {
      type: String,
      required: true,
    },
    Gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female'],
    },
    DOB: {
      type: Date,
      required: true,
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

export const Loyalty = mongoose.model("Loyalty", LoyaltySchema);

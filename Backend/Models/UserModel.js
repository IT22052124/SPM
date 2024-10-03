import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: true,
      
      validate: {
        validator: function(v) {
          return /\d{10}/.test(v); // Ensures it's a valid 10-digit phone number
        },
        message: props => `${props.value} is not a valid phone number!`,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures emails are unique
      validate: {
        validator: function(v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Email format validation
        },
        message: props => `${props.value} is not a valid email!`,
      },
    },
    profilePicture: {
      type: String,
      default: "", // Initialize with an empty string
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export const User = mongoose.model("User", UserSchema);

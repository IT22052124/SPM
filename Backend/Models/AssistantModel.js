import mongoose from "mongoose";

const AssistantSchema = mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  Status: {
    type: String,
    enum: ["available", "busy", "offline"],
    default: "available",
  },
//   assignedRequests: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Request", // Reference to the Request model
//     },
//   ],
  
//   pushToken: {
//     type: String, // Expo push notification token
//     required: false,
//   },

  phone: {
    type:Number,
    required: false,
  },
  
  username: {
    type: String,
    required: true,
  },
  
  password: {
    type: String,
    required: true,
  },
});

export const Assistant = mongoose.model("Assistant", AssistantSchema);


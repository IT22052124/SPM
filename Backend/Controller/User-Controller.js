import { User } from "../Models/UserModel.js"; // Assuming the model file is named UserModel.js
import validator from "validator"; // Import validator for email validation
import bcrypt from "bcrypt"; // Import bcrypt for password hashing

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { name, phoneNumber, email, password, address, dob } = req.body;

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate a unique ID for the user
    const latestUser = await User.find().sort({ _id: -1 }).limit(1);
    let userId;

    if (latestUser.length !== 0) {
      const latestId = parseInt(latestUser[0].userID.slice(1));
      userId = "U" + String(latestId + 1).padStart(4, "0");
    } else {
      userId = "U0001"; // Start with U0001 if no users exist
    }

    // Create new user object
    const newUser = new User({
      userID: userId,
      name,
      phoneNumber,
      email,
      password: hashedPassword,
      address,
      dob,
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    
    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ ID: req.params.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user by ID
export const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find existing user by ID
    const existingUser = await User.findOne({ ID: id });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prepare updated object
    const updatedUser = {
      name: req.body.name || existingUser.name,
      phoneNumber: req.body.phoneNumber || existingUser.phoneNumber,
      email: req.body.email || existingUser.email,
      password: req.body.password || existingUser.password,
      address: req.body.address || existingUser.address,
      gender: req.body.gender || existingUser.gender,
      dob: req.body.dob || existingUser.dob,
    };

    // Hash the password if it is being updated
    if (req.body.password) {
      const saltRounds = 10;
      updatedUser.password = await bcrypt.hash(req.body.password, saltRounds);
    }

    // Update the user in the database
    const user = await User.findOneAndUpdate(
      { ID: id },
      updatedUser,
      { new: true, runValidators: true }
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete user by ID
export const deleteUserById = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ ID: req.params.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

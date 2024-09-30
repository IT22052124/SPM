import {User} from "../Models/UserModel.js"; // Assuming your User model is in models/User.js
import bcrypt from "bcrypt"; // Assuming you are using bcrypt for password hashing
import jwt from "jsonwebtoken"; // Optional: for generating tokens

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // // Optional: Generate a JWT token for authentication (if needed)
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: "1h",
    // });

    return res.status(200).json({
      message: "User logged in successfully.",
    //  token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        // Include other user fields as necessary
      },
    });
  } catch (error) {
    console.error("error");
    return res.status(500).json({ message: "Server error." });
  }
};

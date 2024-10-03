import { Invoice } from "../Models/InvoiceModel.js";
import { Loyalty } from "../Models/LoyaltyModel.js"; // Import the Loyalty model
import { verifyOtp, sendOtp } from "../otpService.js";

// Create a new loyalty customer
export const createLoyaltyCustomer = async (req, res) => {
  try {
    const { phoneNumber, fullName, email, address, gender, dob } = req.body;

    // Server-side validation
    if (!phoneNumber || !fullName || !email || !address || !gender || !dob) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const latestLoyalty = await Loyalty.find().sort({ _id: -1 }).limit(1);
    let id;

    if (latestLoyalty.length !== 0) {
      const latestId = parseInt(latestLoyalty[0].ID.slice(1));
      id = "L" + String(latestId + 1).padStart(4, "0");
    } else {
      id = "L0001";
    }

    const loyaltyCustomer = new Loyalty({
      ID: id,
      Phone: req.body.phoneNumber,
      Name: req.body.fullName,
      Email: req.body.email,
      Address: req.body.address,
      Gender: req.body.gender,
      DOB: req.body.dob,
    });

    console.log(loyaltyCustomer);

    const savedLoyaltyCustomer = await loyaltyCustomer.save();
    res.status(201).json(savedLoyaltyCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all loyalty customers
export const getAllLoyaltyCustomers = async (req, res) => {
  try {
    const loyaltyCustomers = await Loyalty.find();
    res.status(200).json(loyaltyCustomers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a loyalty customer by ID
export const getLoyaltyCustomerById = async (req, res) => {
  try {
    const loyaltyCustomer = await Loyalty.findById(req.params.id);
    if (!loyaltyCustomer) {
      return res.status(404).json({ message: "Loyalty customer not found" });
    }
    res.status(200).json(loyaltyCustomer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a loyalty customer by ID
export const updateLoyaltyCustomer = async (req, res) => {
  try {
    const loyaltyCustomer = await Loyalty.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!loyaltyCustomer) {
      return res.status(404).json({ message: "Loyalty customer not found" });
    }
    res.status(200).json(loyaltyCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a loyalty customer by ID
export const deleteLoyaltyCustomer = async (req, res) => {
  try {
    const loyaltyCustomer = await Loyalty.findByIdAndDelete(req.params.id);
    if (!loyaltyCustomer) {
      return res.status(404).json({ message: "Loyalty customer not found" });
    }
    res.status(200).json({ message: "Loyalty customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loyaltyLogin = async (req, res) => {
  const { phoneNumber, email } = req.body;

  try {
    // Check if the email exists in the database
    const user = await Loyalty.findOne({ Email: email });

    if (user) {
      // If email exists, check if the phone number matches the one associated with the email
      if (user.Phone === phoneNumber) {
        // Both email and phone number match, login successful
        return res.json({
          success: true,
          user, // Return user data
        });
      } else {
        // Phone number doesn't match
        return res.json({
          success: false,
          message: "Invalid phone number",
        });
      }
    } else {
      // If email doesn't exist
      return res.json({
        success: false,
        message: "Email not found",
      });
    }
  } catch (error) {
    console.error("Error logging in", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const loyaltyPurchase = async (req, res) => {
  const { phoneNumber } = req.query;

  try {
    // Fetch purchases and populate product details if needed
    const purchases = await Invoice.find({ LoyaltyPhone: phoneNumber })
      .populate('CartItems.pId'); // Populate product details from CartItems (if necessary)

    res.json(purchases);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Failed to fetch purchases" });
  }
};


export const SendOTP = async (req, res) => {
  const { phoneNumber } = req.body;
  // Generate OTP and send it via SMS
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
  const success = await sendOtp(phoneNumber, otp); // Function to send OTP via SMS

  if (success) {
    // Store OTP in memory/database for later verification
    // You might want to store it in a database with an expiration time
    return res.json({ success: true, message: "OTP sent successfully." });
  } else {
    return res.json({ success: false, message: "Failed to send OTP." });
  }
};

export const VerifyOTP = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  // Compare the entered OTP with the stored OTP
  const isValid = await verifyOtp(phoneNumber, otp); // Implement this function

  if (isValid) {
    const user = await Loyalty.findOne({ phone: phoneNumber }); // Retrieve user data
    return res.json({ success: true, user });
  } else {
    return res.json({ success: false, message: "Invalid OTP." });
  }
};

import { Invoice } from "../Models/InvoiceModel.js";
import { Loyalty } from "../Models/LoyaltyModel.js"; // Import the Loyalty model

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
  const { phoneNumber } = req.body;

  try {
    // Query the database to check if the phone number exists
    const user = await Loyalty.findOne({ Phone: phoneNumber }); // Querying by 'Phone'

    if (user) {
      // If the user exists, return the full user data
      return res.json({
        success: true,
        user, // Send the entire user document
      });
    } else {
      // If the phone number doesn't exist
      return res.json({
        success: false,
        message: "Phone number not found",
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
    const purchases = await Invoice.find({ LoyaltyPhone: phoneNumber });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch purchases" });
  }
};

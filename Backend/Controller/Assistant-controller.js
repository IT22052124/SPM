  import {Assistant} from "../Models/AssistantModel.js"; // Assuming the model file is named AssistantModel.js

// Create a new assistant
export const createAssistant = async (req, res) => {
    try {
      const { name, phone, username, password } = req.body;
  
      // Find the most recent assistant and generate a new employeeId
      const latestAssistant = await Assistant.find().sort({ _id: -1 }).limit(1); 
      let employeeId;
  
      if (latestAssistant.length !== 0) {
        // Extract the numeric part from the employeeId and increment it
        const latestId = parseInt(latestAssistant[0].employeeId.slice(1));
        employeeId = "E" + String(latestId + 1).padStart(4, "0");
      } else {
        // If no assistants exist, start with E0001
        employeeId = "E0001";
      }
  
      // Create new assistant object with generated employeeId
      const newAssistant = new Assistant({
        employeeId,
        name,
        phone,
        username,
        password,
      });
  
      // Save the assistant to the database
      const savedAssistant = await newAssistant.save();
      res.status(201).json(savedAssistant);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

// Get all assistants
export const getAllAssistants = async (req, res) => {
  try {
    const assistants = await Assistant.find();
    res.status(200).json(assistants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get assistant by employee ID
export const getAssistantByEmployeeId = async (req, res) => {
  try {
    const assistant = await Assistant.findOne({ employeeId: req.params.id });
    if (!assistant) {
      return res.status(404).json({ message: "Assistant not found" });
    }
    res.status(200).json(assistant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update assistant by employee ID
export const updateAssistantByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Find existing assistant by employeeId
    const existingAssistant = await Assistant.findOne({ employeeId });
    if (!existingAssistant) {
      return res.status(404).json({ message: "Assistant not found" });
    }

    // Prepare updated object
    const updatedAssistant = {
      name: req.body.name || existingAssistant.name,
      phone: req.body.phone || existingAssistant.phone,
      username: req.body.username || existingAssistant.username,
      password: req.body.password || existingAssistant.password,
      Status: req.body.Status || existingAssistant.Status,
    };

    // Update the assistant in the database
    const assistant = await Assistant.findOneAndUpdate(
      { employeeId },
      updatedAssistant,
      { new: true, runValidators: true }
    );

    res.status(200).json(assistant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete assistant by employee ID
export const deleteAssistantByEmployeeId = async (req, res) => {
  try {
    const assistant = await Assistant.findOneAndDelete({
      employeeId: req.params.id,
    });
    if (!assistant) {
      return res.status(404).json({ message: "Assistant not found" });
    }
    res.status(200).json({ message: "Assistant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get available assistants
export const getAvailableAssistants = async (req, res) => {
  try {
    const availableAssistants = await Assistant.find({ Status: "available" });
    res.status(200).json(availableAssistants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

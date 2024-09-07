import { Promotion } from "../Models/PromotionModel.js"; // Import the Promotion model

// Create a new promotion
export const createPromotion = async (req, res) => {
  try {
    console.log(req.body)
    const { promotionName, productID, product, minPurchase, maxDiscount, eligibility, description, imageUrl, startDate, endDate } = req.body;

    // Server-side validation
    if (!promotionName || !product || !eligibility) {
      return res.status(400).json({ message: "Promotion name, product, and eligibility are required." });
    }

    const latestPromotion = await Promotion.find().sort({ _id: -1 }).limit(1);
    let id;

    if (latestPromotion.length !== 0) {
        const latestId = parseInt(latestPromotion[0].ID.slice(2));
        id = "PR" + String(latestId + 1).padStart(4, "0");
    } else {
        id = "PR0001";
    }

    const promotion = new Promotion({
        ID: id,
        promotionName: promotionName,
        product: product,
        minPurchase: minPurchase || null,
        maxDiscount: maxDiscount || null,
        eligibility: eligibility,
        description: description,
        imageUrl: req.body.imageUrl.map((image) => image.url) || null,
        startDate: startDate,
        endDate: endDate
    });

    if (productID !== 'all') {
      promotion.productID = productID;
    }
    else{
      promotion.productID = null;
    }

    const savedPromotion = await promotion.save();
    res.status(201).json(savedPromotion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all promotions
export const getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find().populate('productID'); 
    res.status(200).json(promotions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a promotion by ID
export const getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }
    res.status(200).json(promotion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a promotion by ID
export const updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }
    res.status(200).json(promotion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a promotion by ID
export const deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }
    res.status(200).json({ message: "Promotion deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

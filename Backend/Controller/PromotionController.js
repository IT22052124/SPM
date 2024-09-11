import { Promotion } from "../Models/PromotionModel.js"; // Import the Promotion model

// Create a new promotion
export const createPromotion = async (req, res) => {
  try {
    const {
      promotionName,
      productID,
      product,
      minPurchase,
      maxDiscount,
      eligibility,
      description,
      imageUrl,
      startDate,
      endDate,
      promotionPercentage,
    } = req.body;

    // Server-side validation
    if (!promotionName || !product || !eligibility || !promotionPercentage) {
      return res
        .status(400)
        .json({
          message:
            "Promotion name, product, promotionPercentage, and eligibility are required.",
        });
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
      endDate: endDate,
      discPercentage: promotionPercentage,
    });

    if (productID !== "all") {
      promotion.productID = productID;
    } else {
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
    const promotions = await Promotion.find().populate("productID");
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
    console.log("hre")
    const existingPromotion = await Promotion.findById(req.params.id);
    if (!existingPromotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    const {
      promotionName,
      productID,
      product,
      minPurchase,
      maxDiscount,
      eligibility,
      description,
      imageUrl,
      startDate,
      endDate,
      promotionPercentage,
    } = req.body;

    const updatePromotion = {
      promotionName: promotionName || existingPromotion.promotionName,
      product: product || existingPromotion.product,
      minPurchase: minPurchase || existingPromotion.minPurchase,
      maxDiscount: maxDiscount || existingPromotion.maxDiscount,
      eligibility: eligibility || existingPromotion.eligibility,
      description: description || existingPromotion.description,
      imageUrl: req.body.imageUrl ? req.body.imageUrl.map((image) => image) : existingPromotion.imageUrl,
      startDate: startDate || existingPromotion.startDate,
      endDate: endDate || existingPromotion.endDate,
      discPercentage:
        promotionPercentage || existingPromotion.promotionPercentage,
    };

    updatePromotion.productID = productID !== "all" ? productID : null;

    console.log(updatePromotion)

    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      updatePromotion,
      {
        new: true,
        runValidators: true,
      }
    );

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

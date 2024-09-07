import { Product } from "../Models/ProductModel.js"; // Use `import` for ES modules and add the `.js` extension

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const latestProduct = await Product.find().sort({ _id: -1 }).limit(1);
    let id;

    if (latestProduct.length !== 0) {
      const latestId = parseInt(latestProduct[0].ID.slice(1));
      id = "P" + String(latestId + 1).padStart(4, "0");
    } else {
      id = "P0001";
    }
    const newProduct = {
      ID: id,
      name: req.body.productName,
      Description: req.body.description,
      BasePrice: req.body.basePrice,
      DiscountType: req.body.discountType,
      DiscountPercentage: req.body.discountPercentage,
      SKU: req.body.sku,
      Barcode: req.body.barcode,
      Quantity: req.body.quantity,
      Category: req.body.category,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl.map((image) => image.url),
    };

    console.log(newProduct);

    const savedProducts = await Product.create(newProduct);
    res.status(201).json(savedProducts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a product by ID
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const { flavor, budget } = req.query;

    // If both flavor and budget are provided, filter products based on tags
    if (flavor && budget) {
      const products = await Product.find({
        tags: { $all: [flavor, budget] }, // Filter products that have both flavor and budget tags
      });
      res.status(200).json(products);
    } else {
      // If no filters are provided, return all products
      const products = await Product.find();
      res.status(200).json(products);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

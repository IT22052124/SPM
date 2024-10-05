import { Product } from "../Models/ProductModel.js";
import { Invoice } from "../Models/InvoiceModel.js"; // Use `import` for ES modules and add the `.js` extension

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
      Unit: req.body.unit,
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

export const getAllProductsByCategory = async (req, res) => {
  const { category } = req.params; // Assuming category comes from the URL params
  try {
    const products = await Product.find({ Category: category });
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

export const getProductByBarcode = async (req, res) => {
  try {
    const product = await Product.find({
      Barcode: req.params.Barcode,
    });
    if (!product) {
      return res.status(404).json({ message: "No Barcode Found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a product by ID
export const updateProduct = async (req, res) => {
  try {
    // Find the existing product by ID
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Prepare the update object
    const updatedProduct = {
      // Retain existing ID if not provided
      name: req.body.productName || existingProduct.name,
      Description: req.body.description || existingProduct.Description,
      BasePrice: req.body.basePrice || existingProduct.BasePrice,
      DiscountType: req.body.discountType || existingProduct.DiscountType,
      DiscountPercentage:
        req.body.discountPercentage || existingProduct.DiscountPercentage,
      SKU: req.body.sku || existingProduct.SKU,
      Barcode: req.body.barcode || existingProduct.Barcode,
      Unit: req.body.unit || existingProduct.Unit,
      Quantity: req.body.quantity || existingProduct.Quantity,
      Category: req.body.category || existingProduct.Category,
      tags: req.body.tags || existingProduct.tags,
      imageUrl: req.body.imageUrl
        ? req.body.imageUrl.map((image) => image)
        : existingProduct.imageUrl,
    };

    // Update the product with the new values
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updatedProduct,
      {
        new: true,
        runValidators: true,
      }
    );

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

export const getAllBarcodes = async (req, res) => {
  try {
    const barcodes = await Product.find({}, { Barcode: 1, _id: 0 });
    res.status(200).json(barcodes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const { flavor, budget } = req.query;
    if (flavor && budget) {
      const Flavor = "#" + flavor.toLowerCase();
      const Budget = "#" + budget.toLowerCase();

      const products = await Product.find({
        tags: { $all: [Flavor, Budget] },
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

export const GetProductReportByDateRange = async (req, res) => {
  try {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    // Find all invoices within the date range
    const invoices = await Invoice.find({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    // Extract unique product IDs from invoices
    const productIds = [
      ...new Set(
        invoices.flatMap((invoice) => invoice.CartItems.map((item) => item.pId))
      ),
    ];

    // Find all products related to the extracted product IDs
    const products = await Product.find({ _id: { $in: productIds } });

    // Aggregate total product units, unit type, and total price from invoices
    const invoiceProductUnits = await Invoice.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      { $unwind: "$CartItems" },
      {
        $group: {
          _id: "$CartItems.pId",
          totalInvoiceUnits: { $sum: "$CartItems.quantity" },
          unit: { $first: "$CartItems.unit" }, // Get the unit of the product
          totalPrice: {
            $sum: { $multiply: ["$CartItems.quantity", "$CartItems.price"] },
          },
          finalTotal: { $sum: "$CartItems.DiscountedTotal" },
        },
      },
    ]);

    // Map product IDs to their total invoice units, unit type, and total price
    const combinedProductUnits = {};
    invoiceProductUnits.forEach((item) => {
      combinedProductUnits[item._id] = {
        totalInvoiceUnits: item.totalInvoiceUnits,
        unit: item.unit, // Add unit to the mapping
        totalPrice: item.totalPrice,
        finalTotal: item.finalTotal,
      };
    });

    // Prepare the final product details including total units, unit type, and total price from invoices
    const productDetails = products.map((product) => {
      const productUnits = combinedProductUnits[product._id] || {
        totalInvoiceUnits: 0,
        unit: "", // Default value if no unit is found
        totalPrice: 0,
        finalTotal: 0,
      };
      const totalUnits = productUnits.totalInvoiceUnits;
      const unit = productUnits.unit; // Get the unit type
      const totalPrice = productUnits.totalPrice;
      const finalTotal = productUnits.finalTotal;

      return {
        ...product.toObject(),
        totalUnits,
        unit, // Include the unit type in the response
        totalInvoiceUnits: productUnits.totalInvoiceUnits,
        totalPrice,
        finalTotal,
      };
    });

    // Send the final response
    res.json(productDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

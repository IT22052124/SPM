import { Invoice } from "../Models/InvoiceModel.js";
import { Loyalty } from "../Models/LoyaltyModel.js";
import { Product } from "../Models/ProductModel.js";

export const createInvoice = async (req, res) => {
  try {
    const {
      cartitem,
      totalAmount,
      paidAmount,
      balance,
      isLoyaltyCustomer,
      loayltyCus,
      points,
    } = req.body;

    // Get the latest invoice and generate a new invoice ID
    const latestOrder = await Invoice.find().sort({ _id: -1 }).limit(1);
    let id;
    if (latestOrder.length !== 0) {
      const latestId = parseInt(latestOrder[0].invoiceId.slice(1));
      id = "I" + String(latestId + 1).padStart(4, "0");
    } else {
      id = "I0001";
    }

    // Update product stock and prepare cart items for the invoice
    const items = await Promise.all(
      cartitem.map(async (item) => {
        await Product.findByIdAndUpdate(item._id, {
          $inc: { Quantity: -item.quantity },
        });

        return {
          pId: item._id,
          productId: item.ID,
          price: item.BasePrice,
          unit: item.Unit,
          quantity: item.quantity,
          total: item.total,
          promoId: item.selectedPromotion?.promotionID || null,
          promoName: item.selectedPromotion?.promotionName || null,
          promoPercentage: item.selectedPromotion?.discountPercentage || null,
          DiscountedTotal: item.discountedTotal,
        };
      })
    );

    const newInvoice = {
      invoiceId: id,
      CusType: isLoyaltyCustomer ? "Loyalty" : "All",
      LoyaltyId: loayltyCus.custID ? loayltyCus.custID : null,
      LoyaltyPhone: loayltyCus.custPhone ? loayltyCus.custPhone : null,
      LoyaltyName: loayltyCus.custName ? loayltyCus.custName : null,
      CartItems: items,
      finalTotal: totalAmount,
      paidAmount: paidAmount,
      balance: balance,
    };

    const invoice = await Invoice.create(newInvoice);

    // If the customer is a loyalty customer, add points
    if (isLoyaltyCustomer && loayltyCus.custID) {
      const pointsToAdd = totalAmount / 100; // Points are 1/100 of the final total
      await Loyalty.findByIdAndUpdate(loayltyCus.custID, {
        $inc: { Points: pointsToAdd },
      });
      await Loyalty.findByIdAndUpdate(loayltyCus.custID, {
        $inc: { Points: -(points || 0) },
      });
    }

    res.status(201).json({ message: "Order placed successfully", invoice });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const listInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.find({})
      .sort({ _id: -1 })
      .populate({ path: "CartItems.pId" })
      .populate({ path: "LoyaltyId" });
    return res.status(200).json(invoice);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

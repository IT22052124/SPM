import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Select from "react-tailwindcss-select";
import Toast from "../../components/Toast/Toast";
import { useReactToPrint } from "react-to-print";
import { FaTrash } from "react-icons/fa6";
// import PrintQuotation from "./component/PrintQuotation";
import Loader from "../../components/Loader/Loader";
import RealTimeClock from "../../components/RealTimeClock";
import "./GlitchButton.css";
import BarcodeScannerComponent from "../../components/BarcodeScannerComponent";

const Billing = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [openPaymentBox, setOpenPaymentBox] = useState(false);
  const [val, setVal] = useState(null);
  const [paidAmount, setPaidAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [temp, setTemp] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [isLoyaltyCustomer, setIsLoyaltyCustomer] = useState(false);

  const handlePromoChange = (selectedOption, index) => {
    if (selectedOption) {
      const updatedItems = [...selectedItems];
      const selectedPromotion = promotions.find(
        (promo) => promo._id === selectedOption.value
      );
      const discountPercentage = selectedPromotion?.discPercentage || 0;

      updatedItems[index].selectedPromotion = {
        promotionID: selectedOption.value,
        promotionName: selectedOption.label,
        discountPercentage, // Add discount percentage
      };

      // Calculate discounted total
      const originalTotal = updatedItems[index].total;
      const discountedTotal =
        originalTotal - originalTotal * (discountPercentage / 100);

      updatedItems[index].discountedTotal = discountedTotal; // Add discounted total
      setSelectedItems(updatedItems);
    }
  };

  const addItem = (item) => {
    const existingItemIndex = selectedItems.findIndex(
      (selectedItem) => selectedItem._id === item._id
    );

    if (existingItemIndex !== -1) {
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex].quantity += 1;
      updatedItems[existingItemIndex].total =
        updatedItems[existingItemIndex].quantity * item.price;

      // Update discounted total
      const discountPercentage =
        updatedItems[existingItemIndex].selectedPromotion?.discountPercentage ||
        0;
      updatedItems[existingItemIndex].discountedTotal =
        updatedItems[existingItemIndex].total -
        updatedItems[existingItemIndex].total * (discountPercentage / 100);

      setSelectedItems(updatedItems);
    } else {
      const discountPercentage = 0; // Default to 0 if no promotion is selected
      setSelectedItems((prevItems) => [
        ...prevItems,
        {
          ...item,
          quantity: 1,
          total: item.BasePrice,
          selectedPromotion: null,
          discountedTotal: item.BasePrice, // Initialize discounted total
        },
      ]);
      setTotalItems((prevTotalItems) => prevTotalItems + 1);
    }

    setTotalAmount(
      (prevTotalAmount) =>
        parseFloat(prevTotalAmount) + parseFloat(item.BasePrice)
    );
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/product/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [temp]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/promotion/promotions")
      .then((res) => {
        setPromotions(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleChange = (value) => {
    setVal(value);
    const selectedProduct = products.find(
      (product) => product._id === value.value
    );

    if (selectedProduct && selectedProduct.Quantity > 0) {
      addItem(selectedProduct);
    } else {
      Toast("This product is out of stock", "error");
    }
  };

  const handleUpdate = (text, result) => {
    const selectedProduct = products.find(
      (product) => product.Barcode === text
    );
    if (selectedProduct) {
      addItem(selectedProduct);
    } else {
      Toast("No Product For this Barcode", "error");
    }
    console.log("Barcode Result:", result);
  };

  const handleQuantityChange = (index, quantity) => {
    const newSelectedItems = [...selectedItems];
    const maxStock = newSelectedItems[index].Quantity;

    if (!quantity || quantity === "") {
      quantity = 1; // Default to 1 if no quantity is provided
    }

    if (quantity <= maxStock) {
      newSelectedItems[index].quantity = quantity;
      newSelectedItems[index].total =
        parseFloat(newSelectedItems[index].BasePrice) * parseInt(quantity);

      // Update discounted total
      const discountPercentage =
        newSelectedItems[index].selectedPromotion?.discountPercentage || 0;
      newSelectedItems[index].discountedTotal =
        newSelectedItems[index].total -
        newSelectedItems[index].total * (discountPercentage / 100);

      setSelectedItems(newSelectedItems);

      const newTotalAmount = newSelectedItems.reduce(
        (acc, item) => acc + parseFloat(item.total),
        0
      );
      setTotalAmount(newTotalAmount);
    } else {
      Toast(`Quantity cannot exceed stock of ${maxStock}`, "error");
    }
  };

  const handleEmptyQuantity = (index) => {
    const newSelectedItems = [...selectedItems];

    if (
      !newSelectedItems[index].quantity ||
      newSelectedItems[index].quantity === ""
    ) {
      newSelectedItems[index].quantity = 1;
      newSelectedItems[index].total =
        parseFloat(newSelectedItems[index].BasePrice) * parseInt(1);
      setSelectedItems(newSelectedItems);

      const newTotalAmount = newSelectedItems.reduce(
        (acc, item) => acc + parseFloat(item.total),
        0
      );
      setTotalAmount(newTotalAmount);
    }
  };

  const handleDelete = (index) => {
    const itemToRemove = selectedItems[index];
    const newSelectedItems = selectedItems.filter((_, i) => i !== index);

    setSelectedItems(newSelectedItems);
    setTotalItems((prevTotalItems) => prevTotalItems - 1);
    setTotalAmount(
      (prevTotalAmount) =>
        parseFloat(prevTotalAmount) - parseFloat(itemToRemove.total)
    );
  };

  const handlesubmit = () => {
    setLoading(true);
    axios
      .post("http://localhost:5000/invoice/new/", {
        cartitem: selectedItems,
      })
      .then((res) => {
        console.log(res.data);
        Toast("Payment Success!", "success");
        setSelectedItems([]);
        setOpenPaymentBox(!openPaymentBox);
        setTotalItems(0);
        setTotalAmount(0);
        setPaidAmount(0);
        setBalance(0);
        setTemp(temp + 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(true);
      });
  };
  const handlePaidAmountChange = (e) => {
    const amount = parseFloat(e.target.value);
    setPaidAmount(e.target.value);
    setBalance(amount - totalAmount);
  };

  const togglePaymentBox = () => {
    if (totalItems === 0) {
      Toast("No Item in List", "error");
      return;
    }
    if (paidAmount < totalAmount) {
      Toast(
        "Paid amount must be equal to or greater than the total amount",
        "error"
      );
      return;
    } else {
      setOpenPaymentBox(!openPaymentBox);
    }
  };

  return (
    <>
      <div className="h-dvh -mt-4">
        <div className="relative w-full mx-36 ">
          <RealTimeClock />
          <div className="grid grid-cols-2 mt-5 gap-4 p-5  text-black ">
            <div className="shadow-custom p-5 bg-white">
              <h5 className="mb-1 ml-3 text-black text-center font-bold text-xl">
                Add Billing Item
              </h5>
              <div className="relative  mb-4">
                <Select
                  isSearchable
                  value={val}
                  primaryColor={"red"}
                  onChange={handleChange}
                  options={products.map((product) => ({
                    value: product._id,
                    label: `${product.ID} ${product.name} Price: Rs.${product.BasePrice} Stock: ${product.Quantity}`,
                  }))}
                />
              </div>
              <table className="w-full border-collapse border  border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 w-1/12"></th>
                    <th className="border border-gray-300 p-2 w-1/12">ID</th>
                    <th className="border border-gray-300 p-2 w-2/12">Name</th>
                    <th className="border border-gray-300 p-2 w-2/12">
                      Quantity
                    </th>
                    <th className="border border-gray-300 p-2 w-3/12">
                      Price (LKR)
                    </th>
                    <th className="border border-gray-300 p-2 w-3/12">
                      Total (LKR)
                    </th>
                    <th className="border border-gray-300 p-2 w-3/12">
                      Promotions
                    </th>
                    <th className="border border-gray-300 p-2 w-3/12">
                      Discounted Price (LKR)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItems.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">
                        <button
                          onClick={() => handleDelete(index)}
                          className="bg-red-500 text-white p-1 rounded"
                        >
                          <FaTrash />
                        </button>
                      </td>
                      <td className="border border-gray-300 p-2">{item.ID}</td>
                      <td className="border border-gray-300 p-2">
                        {item.name}
                      </td>
                      <td className="border border-gray-300 p-2">
                        <input
                          type="number"
                          className="w-full border bg-white border-gray-300 p-2"
                          value={item.quantity}
                          min="1"
                          max={item.Quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              index,
                              parseInt(e.target.value)
                            )
                          }
                          onBlur={() => handleEmptyQuantity(index)}
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        {item.BasePrice}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {item.total}
                      </td>
                      <td className="border border-gray-300 p-2">
                        <Select
                          isSearchable
                          value={
                            item.selectedPromotion
                              ? {
                                  value: item.selectedPromotion.promotionID,
                                  label: item.selectedPromotion.promotionName,
                                }
                              : null
                          }
                          onChange={(selectedOption) =>
                            handlePromoChange(selectedOption, index)
                          }
                          primaryColor={"blue"}
                          placeholder={
                            <div className="flex items-center justify-center">
                              <span className="mr-2">🔍</span>
                              <span>Select Promotion</span>
                            </div>
                          }
                          classNames={{
                            control: () => "flex items-center justify-center",
                            valueContainer: "flex items-center justify-center",
                          }}
                          options={promotions
                            .filter((promo) => {
                              if (isLoyaltyCustomer) {
                                return (
                                  ((promo.productID &&
                                    promo.productID._id &&
                                    promo.productID._id === item._id) ||
                                    promo.product === "All Products") &&
                                  (promo.eligibility === "All Customers" ||
                                    promo.eligibility === "Loyalty Customers")
                                );
                              } else {
                                return (
                                  ((promo.productID &&
                                    promo.productID._id &&
                                    promo.productID._id === item._id) ||
                                    promo.product === "All Products") &&
                                  promo.eligibility === "All Customers"
                                );
                              }
                            })
                            .map((p) => ({
                              value: p._id,
                              label: p.promotionName,
                            }))}
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        {item.discountedTotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col justify-between shadow-custom bg-white">
              <div className="relative flex m-16">
                <input
                  type="checkbox"
                  onChange={() => {
                    setIsLoyaltyCustomer(!isLoyaltyCustomer);
                  }}
                  id="choose-me"
                  className="absolute top-[calc(50%-theme(spacing.2))] peer w-4 h-4 left-6 accent-purple-500 rounded-full"
                />

                <label
                  htmlFor="choose-me"
                  className="p-8 font-bold  accent-purple-500 transition-colors duration-200 ease-in-out border-2 rounded select-none pl-14 peer-checked:text-fuchsia-600 peer-checked:border-fuchsia-600"
                >
                  Loyalty Customer
                </label>
                <button
                  onClick={() => setShowModal(!showModal)}
                  className="button-49 bg-white ml-28"
                  role="button"
                >
                  Scan
                </button>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Invoice Summary</h2>
                <div className="border p-4 rounded mb-4">
                  <p>Total Items: {totalItems}</p>
                  <p>Total Amount: LKR {totalAmount.toFixed(2)}</p>
                  <div className="mb-4">
                    <label htmlFor="paidAmount" className="block mb-2">
                      Paid Amount:
                    </label>
                    <input
                      type="number"
                      id="paidAmount"
                      className="w-3/4 border bg-white border-gray-300 p-2"
                      value={paidAmount}
                      onChange={handlePaidAmountChange}
                    />
                  </div>
                  <p>Balance: Rs. {balance.toFixed(2)}</p>
                </div>
              </div>
              <button
                onClick={togglePaymentBox}
                className="bg-blue-500 text-white p-2 rounded mt-4"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
      {openPaymentBox && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur confirm-dialog">
          <div className="relative px-4 min-h-screen md:flex md:items-center md:justify-center">
            <div className="opacity-25 w-full h-full absolute z-10 inset-0"></div>
            <div className="bg-white rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative shadow-lg">
              {loading ? (
                <>
                  <Loader />
                </>
              ) : (
                <>
                  <div className="md:flex items-center text-black">
                    <div className="rounded-full border border-gray-300 flex items-center justify-center w-16 h-16 flex-shrink-0 mx-auto">
                      <i className="bx bx-error text-3xl">&#9888;</i>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                      <p className="font-bold">Warning!</p>
                      <p className="text-sm text-gray-700 mt-1">
                        Are you sure? Do you want to proceed?
                      </p>
                    </div>
                  </div>
                  <div className="text-center md:text-right mt-4 md:flex md:justify-end">
                    <button
                      onClick={handlesubmit}
                      className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-orange-600 text-white rounded-lg font-semibold text-sm md:ml-2 md:order-2"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => {
                        setOpenPaymentBox(!openPaymentBox);
                      }}
                      className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-200 rounded-lg font-semibold text-sm mt-4 md:mt-0 md:order-1"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 h-4/5 relative">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setShowModal(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div>
              <BarcodeScannerComponent
                width={700}
                height={500}
                onUpdate={handleUpdate}
                isModalOpen={showModal}
                setIsModalOpen={setShowModal}
                Notify
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Billing;

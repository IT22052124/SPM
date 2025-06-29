import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-tailwindcss-select";
import Toast from "../../components/Toast/Toast";
import { FaTrash } from "react-icons/fa6";
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
  const [loyalty, setLoyalty] = useState([]);
  const [selectedCust, setSelectedCust] = useState({
    custID: "",
    custName: "",
    custPhone: "",
    custPoints: null,
  });
  const [points, setPoints] = useState(0);

  // Recalculate totalAmount whenever selectedItems change
  useEffect(() => {
    const updatedTotalAmount = selectedItems.reduce(
      (acc, item) => acc + parseFloat(item.discountedTotal || 0),
      0
    );
    setTotalAmount(updatedTotalAmount);
  }, [selectedItems]);

  const handleCustChange = (selectedOption) => {
    if (selectedOption) {
      const selectedCustomer = loyalty.find(
        (customer) => customer._id === selectedOption.value
      );
      setSelectedCust({
        custID: selectedCustomer._id,
        custName: selectedCustomer.Name,
        custPhone: selectedCustomer.Phone,
        custPoints: selectedCustomer.Points,
      });
    } else {
      setSelectedCust({
        custID: "",
        custName: "",
        custPhone: "",
        custPoints: null,
      }); // Reset state if no customer is selected
    }
  };

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
        discountPercentage,
      };

      // Calculate discounted total
      const originalTotal = updatedItems[index].total;
      const discountedTotal =
        originalTotal - originalTotal * (discountPercentage / 100);

      updatedItems[index].discountedTotal = discountedTotal;
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
        updatedItems[existingItemIndex].quantity * item.BasePrice; // Use BasePrice

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
          total: item.BasePrice, // Use BasePrice
          selectedPromotion: null,
          discountedTotal: item.BasePrice,
        },
      ]);
      setTotalItems((prevTotalItems) => prevTotalItems + 1);
    }

    // No need to setTotalAmount here; useEffect handles it
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
  }, [temp]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/loyalty/loyalty-customers")
      .then((res) => {
        setLoyalty(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [temp]);

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
      // totalAmount will be updated by useEffect
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
        parseFloat(newSelectedItems[index].BasePrice) * 1;

      // Update discounted total based on existing promotion, if any
      const discountPercentage =
        newSelectedItems[index].selectedPromotion?.discountPercentage || 0;
      newSelectedItems[index].discountedTotal =
        newSelectedItems[index].total -
        newSelectedItems[index].total * (discountPercentage / 100);

      setSelectedItems(newSelectedItems);
      // totalAmount will be updated by useEffect
    }
  };

  const handleDelete = (index) => {
    const itemToRemove = selectedItems[index];
    const newSelectedItems = selectedItems.filter((_, i) => i !== index);

    setSelectedItems(newSelectedItems);
    setTotalItems((prevTotalItems) => prevTotalItems - 1);
    // totalAmount will be updated by useEffect
  };

  const handlesubmit = () => {
    setLoading(true);
    axios
      .post("http://localhost:5000/invoice/new/", {
        cartitem: selectedItems,
        totalAmount: isLoyaltyCustomer ? totalAmount - points : totalAmount,
        paidAmount: paidAmount,
        balance: balance,
        isLoyaltyCustomer: isLoyaltyCustomer,
        loayltyCus: selectedCust,
        points: points,
      })
      .then((res) => {
        console.log(res.data);
        Toast("Payment Success!", "success");
        setSelectedItems([]);
        setOpenPaymentBox(false); // Changed to false to close the box
        setTotalItems(0);
        setTotalAmount(0);
        setPaidAmount(0);
        setBalance(0);
        setIsLoyaltyCustomer(false);
        setSelectedCust({
          custID: "",
          custPhone: "",
          custName: "",
          custPoints: null,
        });
        setTemp(temp + 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        Toast("Payment Failed!", "error"); // Added error toast
        setLoading(false); // Changed to false to stop loading
      });
  };

  const handlePaidAmountChange = (e) => {
    const amount = parseFloat(e.target.value);
    if (isNaN(amount)) {
      setPaidAmount(0);
      if (isLoyaltyCustomer) {
        setBalance(-(totalAmount - points));
      } else {
        setBalance(-totalAmount);
      }
    } else {
      setPaidAmount(amount);
      if (isLoyaltyCustomer) {
        setBalance(amount - (totalAmount - points));
      } else {
        setBalance(amount - totalAmount);
      }
    }
  };

  const handlePointsChange = (e) => {
    const point = parseFloat(e.target.value);

    if (isNaN(point)) {
      setPoints(0);
    } else {
      setPoints(point);
    }
  };

  const togglePaymentBox = () => {
    if (totalItems === 0) {
      Toast("No Item in List", "error");
      return;
    }
    if (isLoyaltyCustomer) {
      if (paidAmount < totalAmount - points) {
        Toast(
          "Paid amount must be equal to or greater than the total amount",
          "error"
        );
        return;
      } else {
        setOpenPaymentBox(!openPaymentBox);
      }
    } else {
      if (paidAmount < totalAmount) {
        Toast(
          "Paid amount must be equal to or greater than the total amount",
          "error"
        );
        return;
      } else {
        setOpenPaymentBox(!openPaymentBox);
      }
    }
  };

  return (
    <>
      <div className="h-dvh -mt-4">
        <div className="relative w-full mx-36 ">
          <RealTimeClock />
          <div className="grid grid-cols-[3fr_2fr] mt-5 gap-4 p-5 text-black ">
            {/* Add Billing Item Section */}
            <div className="shadow-custom p-5 bg-white">
              <h5 className="mb-1 ml-3 text-black text-center font-bold text-xl">
                Add Billing Item
              </h5>
              <div className="relative mb-4">
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
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 w-1/20"></th>
                    <th className="border border-gray-300 p-2 w-1/20">ID</th>
                    <th className="border border-gray-300 p-2 w-2/20">Name</th>
                    <th className="border border-gray-300 p-2 w-1/20">
                      Quantity
                    </th>
                    <th className="border border-gray-300 p-2 w-1/20">
                      Price (LKR)
                    </th>
                    <th className="border border-gray-300 p-2 w-1/20">
                      Total (LKR)
                    </th>
                    <th className="border border-gray-300 p-2 w-10/20">
                      Promotions
                    </th>
                    <th className="border border-gray-300 p-2 w-2/20">
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
                        {item.BasePrice.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {item.total.toFixed(2)}
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
                            // First filter promotions that are active based on date
                            .filter((promo) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0); // Reset the time to 00:00:00 for the current date

                              const startDate = new Date(promo.startDate);
                              const endDate = new Date(promo.endDate);
                              startDate.setHours(0, 0, 0, 0); // Reset the time to 00:00:00 for startDate
                              endDate.setHours(0, 0, 0, 0); // Reset the time to 00:00:00 for endDate

                              // Only show promotions that are currently active (based on the date)
                              return startDate <= today && endDate >= today;
                            })
                            .filter((promo) => {
                              // Only show promotions related to the selected product
                              const isRelatedToProduct =
                                (promo.productID &&
                                  promo.productID._id === item._id) ||
                                promo.product === "All Products";

                              // Only show loyalty promotions if the user is a loyalty customer
                              const isEligibleForLoyaltyPromo =
                                isLoyaltyCustomer
                                  ? promo.eligibility === "All Customers" ||
                                    promo.eligibility === "Loyalty Customers"
                                  : promo.eligibility === "All Customers";

                              return (
                                isRelatedToProduct && isEligibleForLoyaltyPromo
                              );
                            })
                            .map((promo) => {
                              let isClickable = item.total >= promo.minPurchase;

                              return {
                                value: promo._id,
                                label:
                                  `${promo.promotionName} , ${promo.discPercentage}%` +
                                  (isClickable
                                    ? ""
                                    : ` , ${promo.minPurchase}`), // Append minPurchase only for disabled
                                disabled: !isClickable, // Mark as disabled if not clickable
                              };
                            })
                            // Sort promotions by discPercentage in descending order
                            .sort(
                              (a, b) => b.discPercentage - a.discPercentage
                            )}
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

            {/* Invoice Summary Section */}
            <div className="flex flex-col justify-between shadow-custom bg-white">
              <div className="relative mt-10 mb-10">
                <div className="flex">
                  <div className="w-1/2 ml-3">
                    <label
                      htmlFor="choose-me"
                      className="p-5 font-bold accent-purple-500 transition-colors duration-200 ease-in-out border-2 rounded select-none flex items-center space-x-4 peer-checked:text-fuchsia-600 peer-checked:border-fuchsia-600"
                    >
                      <input
                        type="checkbox"
                        checked={isLoyaltyCustomer}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setIsLoyaltyCustomer(isChecked);

                          if (!isChecked) {
                            setSelectedCust({
                              custID: "",
                              custName: "",
                              custPhone: "",
                            });
                          }
                        }}
                        id="choose-me"
                        className="w-4 h-4 accent-purple-500 rounded-full"
                      />
                      <span className="pl-4">Loyalty Customer</span>
                    </label>
                  </div>

                  <div className="w-1/2">
                    <button
                      onClick={() => setShowModal(!showModal)}
                      className="button-49 bg-white"
                      role="button"
                    >
                      Scan
                    </button>
                  </div>
                </div>

                {isLoyaltyCustomer && (
                  <>
                    <div className="mt-6 w-3/5 pl-6">
                      <Select
                        isSearchable
                        value={
                          selectedCust.custID
                            ? {
                                value: selectedCust.custID,
                                label: `${selectedCust.custPhone} , ${selectedCust.custName}`,
                              }
                            : null
                        }
                        onChange={handleCustChange}
                        primaryColor={"blue"}
                        placeholder={
                          <div className="flex items-center justify-center">
                            {/* Add icon if needed */}
                            <span className="mr-2">🔍</span>
                            <span>Select Customer</span>
                          </div>
                        }
                        classNames={{
                          control: () => "flex items-center justify-center", // This centers the text in the control
                          valueContainer: "flex items-center justify-center", // This centers the selected value
                        }}
                        options={loyalty.map((l) => ({
                          value: l._id,
                          label: `${l.Phone} , ${l.Name}`,
                        }))}
                      />
                    </div>
                    {selectedCust.custID && (
                      <div>
                        <div className="mt-2 w-3/5">
                          <h2 className="text-lg font-semibold">
                            Available Points :{" "}
                            {selectedCust.custPoints
                              ? selectedCust.custPoints.toFixed(2)
                              : "0.00"}
                          </h2>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Invoice Summary</h2>
                <div className="border p-4 rounded mb-4">
                  <p>Total Items: {totalItems}</p>
                  <p>
                    {isLoyaltyCustomer ? "Amount" : "Total Amount"}: LKR{" "}
                    {totalAmount.toFixed(2)}
                  </p>
                  {isLoyaltyCustomer && (
                    <>
                      <div className="w-full grid grid-cols-2">
                        <h2 className="text-base font-normal text-right">
                          Redeem Points :
                        </h2>
                        <input
                          type="number"
                          id="redeemPoints"
                          className="w-3/4 border bg-white border-gray-300"
                          value={points}
                          onChange={handlePointsChange}
                          min="0"
                          max={selectedCust.custPoints || 0}
                        />
                      </div>
                      <p>
                        Final Amount: LKR{" "}
                        {totalAmount.toFixed(2) - points.toFixed(2)}
                      </p>
                    </>
                  )}
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
                      min="0"
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

      {/* Payment Confirmation Modal */}
      {openPaymentBox && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur confirm-dialog">
          <div className="relative px-4 min-h-screen md:flex md:items-center md:justify-center">
            <div className="opacity-25 w-full h-full absolute z-10 inset-0"></div>
            <div className="bg-white rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative shadow-lg">
              {loading ? (
                <Loader />
              ) : (
                <>
                  <div className="md:flex items-center text-black">
                    <div className="rounded-full border border-gray-300 flex items-center justify-center w-16 h-16 flex-shrink-0 mx-auto">
                      <i className="bx bx-error text-3xl">&#9888;</i>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                      <p className="font-bold">Confirm Payment</p>
                      <p className="text-sm text-gray-700 mt-1">
                        Are you sure you want to proceed with the payment?
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
                        setOpenPaymentBox(false);
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

      {/* Barcode Scanner Modal */}
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

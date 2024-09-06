import { useState } from "react";
import { Input, Button, Textarea } from "@material-tailwind/react";
import Select from "react-tailwindcss-select";
import { FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddPromotion = () => {
  const [promotionName, setPromotionName] = useState("");
  const [promotionNameError, setPromotionNameError] = useState("");
  const [product, setProduct] = useState("");
  const [productError, setProductError] = useState("");
  const [minPurchase, setMinPurchase] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [eligibilityError, setEligibilityError] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleProductChange = (selectedOption) => {
    if (selectedOption) {
      setProduct(selectedOption.value);
      setProductError("");
    }
  };

  const handleEligibilityChange = (selectedOption) => {
    if (selectedOption) {
      setEligibility(selectedOption.value);
      setEligibilityError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!promotionName.trim()) {
      setPromotionNameError("Promotion name is required.");
      return;
    }

    if (!product) {
      setProductError("Product selection is required.");
      return;
    }

    if (!eligibility) {
      setEligibilityError("Customer eligibility is required.");
      return;
    }

    setLoading(true);

    const formData = {
      promotionName,
      product,
      minPurchase: minPurchase || "N/A",
      maxDiscount: maxDiscount || "N/A",
      eligibility,
      description,
    };

    try {
      await axios.post("http://localhost:5000/promotions", formData);
      alert("Promotion added successfully!");
      navigate("/promotions"); // Redirect to promotions page
    } catch (err) {
      console.error(err);
      alert("Error adding promotion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-dvh">
      <div className="relative w-full mx-36 mt-5 flex left-28">
        <div className="w-4/6 mr-2">
          <div className="relative flex flex-col flex-auto min-w-0 p-4 mx-6 text-left break-words bg-white border-0 dark:bg-slate-850 dark:shadow-dark-xl shadow-3xl rounded-2xl bg-clip-border">
            <div className="flex flex-wrap -mx-3">
              <div className="flex-none w-auto max-w-full px-3 my-auto">
                <div className="h-full">
                  <h5 className="mb-8 ml-32 text-black font-semibold text-3xl text-center">
                    Add New Promotion
                  </h5>
                </div>
              </div>
            </div>

            {/* Promotion Name */}
            <span className="block text-base font-medium text-gray-700 ml-3">Promotion Name:</span>
            <Input
              type="text"
              placeholder="Enter promotion name"
              value={promotionName}
              onChange={(e) => setPromotionName(e.target.value)}
              onBlur={() => {
                if (!promotionName.trim()) setPromotionNameError("Promotion name is required.");
              }}
              style={{ width: "97%" }}
              className="!border !border-gray-300 mx-3 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:ring-gray-900/10"
              labelProps={{ className: "hidden" }}
              containerProps={{ className: "min-w-[100px]" }}
            />
            {promotionNameError && <p className="text-red-500 text-sm ml-3 mt-1">{promotionNameError}</p>}

            {/* Product Selection */}
            <span className="block text-base font-medium text-gray-700 ml-3 mt-5">Select Product:</span>
            <div className="ml-3">
              <Select
                isSearchable
                value={product ? { value: product, label: product } : null}
                onChange={handleProductChange}
                primaryColor={"blue"}
                placeholder="Select product"
                options={[
                  { value: "Product 1", label: "Product 1" },
                  { value: "Product 2", label: "Product 2" },
                ]}
              />
              {productError && <p className="text-red-500 text-sm mt-1">{productError}</p>}
            </div>

            {/* Minimum Purchase Requirement */}
            <span className="block text-base font-medium text-gray-700 ml-3 mt-5">Minimum Purchase (Optional):</span>
            <Input
              type="number"
              placeholder="Enter minimum purchase amount"
              value={minPurchase}
              onChange={(e) => setMinPurchase(e.target.value)}
              style={{ width: "97%" }}
              className="!border !border-gray-300 mx-3 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:ring-gray-900/10"
              labelProps={{ className: "hidden" }}
              containerProps={{ className: "min-w-[100px]" }}
            />

            {/* Maximum Discount */}
            <span className="block text-base font-medium text-gray-700 ml-3 mt-5">Maximum Discount (Optional):</span>
            <Input
              type="number"
              placeholder="Enter maximum discount"
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(e.target.value)}
              style={{ width: "97%" }}
              className="!border !border-gray-300 mx-3 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:ring-gray-900/10"
              labelProps={{ className: "hidden" }}
              containerProps={{ className: "min-w-[100px]" }}
            />

            {/* Customer Eligibility */}
            <span className="block text-base font-medium text-gray-700 ml-3 mt-5">Customer Eligibility:</span>
            <div className="ml-3">
              <Select
                isSearchable
                value={eligibility ? { value: eligibility, label: eligibility } : null}
                onChange={handleEligibilityChange}
                primaryColor={"blue"}
                placeholder="Select eligibility"
                options={[
                  { value: "All Customers", label: "All Customers" },
                  { value: "Loyalty Customers", label: "Loyalty Customers" },
                ]}
              />
              {eligibilityError && <p className="text-red-500 text-sm mt-1">{eligibilityError}</p>}
            </div>

            {/* Promotion Description */}
            <span className="block text-base font-medium text-gray-700 ml-3 mt-5">Promotion Description:</span>
            <Textarea
              placeholder="Enter promotion description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: "97%" }}
              className="!border !border-gray-300 mx-3 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:ring-gray-900/10"
              labelProps={{ className: "hidden" }}
              containerProps={{ className: "min-w-[100px]" }}
            />

            <div className="mt-10 ml-72">
              <Button
                color="blue"
                onClick={handleSubmit}
                disabled={loading || promotionNameError || productError || eligibilityError}
              >
                {loading ? "Creating..." : "Create Promotion"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPromotion;

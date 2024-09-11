import { useState, useEffect } from "react";
import { GoTriangleRight } from "react-icons/go";
import { Input, Button, Textarea } from "@material-tailwind/react";
import Select from "react-tailwindcss-select";
import { FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import ImageUpload from "../../components/ImageUpload";
import { deleteObject, ref } from "firebase/storage";
import Swal from "sweetalert2";
import Toast from "../../components/Toast/Toast";
import { storage } from "../../storage/firebase";

const UpdatePromotion = () => {
  const { promotionId } = useParams();
  const [promotionName, setPromotionName] = useState("");
  const [promotionNameError, setPromotionNameError] = useState("");
  const [promotionDesError, setPromotionDesError] = useState("");
  const [promotionPercentage, setPromotionPercentage] = useState("");
  const [promotionPercentageError, setPromotionPercentageError] = useState("");
  const [product, setProduct] = useState("");
  const [productID, setProductID] = useState("");
  const [AllProduct, setAllProduct] = useState([]);
  const [productError, setProductError] = useState("");
  const [minPurchase, setMinPurchase] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [progress, setProgress] = useState(0);
  const [eligibility, setEligibility] = useState("");
  const [eligibilityError, setEligibilityError] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");
  const [downloadURLs, setDownloadURLs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/promotion/promotions/${promotionId}`)
      .then((response) => {
        const promotion = response.data;

        setPromotionName(promotion.promotionName);
        setProduct(promotion.product);
        setMinPurchase(promotion.minPurchase);
        setMaxDiscount(promotion.maxDiscount);
        setEligibility(promotion.eligibility);
        setPromotionPercentage(promotion.discPercentage);
        setDescription(promotion.description);
        setStartDate(promotion.startDate.split("T")[0]);
        setEndDate(promotion.endDate.split("T")[0]);
        setDownloadURLs(promotion.imageUrl);
        setProductID(promotion.productID)
      })
      .catch((error) => console.error(error));
  }, [promotionId]);

  const handleProductChange = (selectedOption) => {
    if (selectedOption) {
      setProduct(selectedOption.label);
      setProductID(selectedOption.value);
      setProductError("");
    }
  };

  const handlePromoNameBlur = () => {
    if (!promotionName.trim()) {
      setPromotionNameError("Promotion name is required.");
    } else {
      setPromotionNameError("");
    }
  };

  const handlePromoPercentageBlur = () => {
    if (!promotionPercentage.trim()) {
      setPromotionPercentageError("Promotion percentage is required.");
    } else {
      setPromotionPercentageError("");
    }
  };

  const handlePromoDesBlur = () => {
    if (!description.trim()) {
      setPromotionDesError("Description is required.");
    } else {
      setPromotionDesError("");
    }
  };

  const handleEligibilityChange = (selectedOption) => {
    if (selectedOption) {
      setEligibility(selectedOption.value);
      setEligibilityError("");
    }
  };

  const handleStartDateChange = (e) => {
    const selectedDate = e.target.value;
    const today = new Date().toISOString().split("T")[0];
    if (selectedDate < today) {
      setStartDateError("Start date cannot be in the past.");
    } else {
      setStartDateError("");
    }
    setStartDate(selectedDate);
  };

  const handleEndDateChange = (e) => {
    const selectedDate = e.target.value;
    if (selectedDate < startDate) {
      setEndDateError("End date cannot be before the start date.");
    } else {
      setEndDateError("");
    }
    setEndDate(selectedDate);
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
      productID,
      product,
      minPurchase: minPurchase || null,
      maxDiscount: maxDiscount || null,
      eligibility,
      promotionPercentage,
      description,
      imageUrl: downloadURLs,
      startDate,
      endDate,
    };

    axios
      .put(
        `http://localhost:5000/promotion/promotions/${promotionId}`,
        formData
      )
      .then(() => {
        setLoading(false);
        Toast("Promotion Updated Successfully !", "success");
        navigate("/admin/promotionList"); // Redirect to promotions page
      })
      .catch((err) => {
        console.error(err);
        Toast("Server Error!", "error");
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/product/products")
      .then((res) => {
        setAllProduct(res.data);
        setLoading(false);
        console.log("Product data:", res.data);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDelete = (imageRef, index) => {
    const filePath = imageRef.split("/o/")[1];
    if (!filePath) {
      console.error("Invalid image reference");
      return;
    }

    const decodedFilePath = decodeURIComponent(filePath.split("?")[0]);
    const fileName = decodedFilePath.split("/").pop();
    const storageRef = ref(storage, `images/${fileName}`);
    deleteObject(storageRef)
      .then(() => {
        setDownloadURLs((prevURLs) => prevURLs.filter((_, i) => i !== index));
        console.log("Image deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting image:", error);
      });
  };

  const discardChanges = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Discard it!",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/admin/promotionList");
      }
    });
  };

  return (
    <>
      <div className="relative w-full mx-36 ">
        <div className="relative flex flex-col flex-auto min-w-0 p-4 ml-6 overflow-hidden break-words bg-white border-0 dark:bg-slate-850 dark:shadow-dark-xl shadow-3xl rounded-2xl bg-clip-border">
          <div className="flex flex-wrap -mx-3">
            <div className="flex-none w-auto max-w-full px-3 my-auto">
              <div className="h-full">
                <h5 className="mb-1 ml-3 text-black font-bold text-xl text-left">
                  UPDATE PROMOTION
                </h5>
                <p className="ml-3 font-semibold leading-normal dark:text-black dark:opacity-60 text-sm flex items-center">
                  <Link to={"/admin/Dashboard"}>
                    <span className="text-blue-300 hover:underline">
                      Dashboard
                    </span>
                  </Link>
                  <span className="mx-2" style={{ color: "black" }}>
                    <GoTriangleRight />
                  </span>
                  <Link to={"/admin/promotionList"}>
                    <span className="text-blue-300 hover:underline">
                      Promotion List
                    </span>
                  </Link>
                  <span className="mx-2" style={{ color: "black" }}>
                    <GoTriangleRight />
                  </span>
                  <span className="text-blue-gray-300">Add Promotion</span>
                </p>
              </div>
            </div>
            <div className="w-full max-w-full px-3 mx-auto mt-4 sm:my-auto sm:mr-0 md:w-1/2 md:flex-none lg:w-4/12">
              <div className="relative right-0">
                <ul className="relative flex flex-wrap p-1 list-none bg-gray-50 rounded-xl">
                  <li className="z-30 flex-auto text-center">
                    <button
                      className="select-none bg-white rounded-lg border border-red-300 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-red-300 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                      type="button"
                      onClick={discardChanges}
                    >
                      Discard Changes
                    </button>
                  </li>
                  <li className="z-30 flex-auto text-center">
                    <Button
                      color="blue"
                      onClick={handleSubmit}
                      disabled={
                        loading ||
                        promotionNameError ||
                        productError ||
                        eligibilityError ||
                        !product ||
                        !promotionName ||
                        promotionDesError ||
                        !description ||
                        !startDate ||
                        !endDate ||
                        imageUploading
                      }
                    >
                      {imageUploading ? (
                        <div role="status" className="flex items-center">
                          <span>Uploaing...</span>
                          <svg
                            aria-hidden="true"
                            className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 ml-2"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                        </div>
                      ) : loading ? (
                        <div role="status" className="flex items-center">
                          <span>Updating...</span>
                          <svg
                            aria-hidden="true"
                            className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 ml-2"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                        </div>
                      ) : (
                        "Update Promotion"
                      )}
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-dvh w-full mx-36">
        <div className="flex flex-row ...">
          <div className="w-3/5 relative mt-5 flex">
            <div className="mr-2" style={{ width: "96%" }}>
              <div className="relative w-full flex flex-col flex-auto min-w-0 p-4 mx-6 text-left break-words bg-white border-0 dark:bg-slate-850 dark:shadow-dark-xl shadow-3xl rounded-2xl bg-clip-border">
                <div className="flex flex-wrap -mx-3">
                  <div className="flex-none w-auto max-w-full px-3 my-auto">
                    <div className="h-full">
                      <h5 className="mb-8 ml-10 text-black font-semibold text-xl text-center">
                        Add New Promotion
                      </h5>
                    </div>
                  </div>
                </div>

                {/* Promotion Name */}
                <span className="block text-base font-medium text-gray-700 ml-3">
                  Promotion Name:
                </span>
                <Input
                  type="text"
                  placeholder="Enter promotion name"
                  value={promotionName}
                  onChange={(e) => setPromotionName(e.target.value)}
                  onBlur={handlePromoNameBlur}
                  style={{ width: "97%" }}
                  className="!border !border-gray-300 mx-3 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:ring-gray-900/10"
                  labelProps={{ className: "hidden" }}
                  containerProps={{ className: "min-w-[100px]" }}
                />
                {promotionNameError && (
                  <p className="text-red-500 text-sm ml-3 mt-1">
                    {promotionNameError}
                  </p>
                )}

                {/* Product Selection */}
                <span className="block text-base font-medium text-gray-700 ml-3 mt-5">
                  Select Product:
                </span>
                <div className="ml-3">
                  <Select
                    isSearchable
                    value={
                      product ? { value: productID, label: product } : null
                    }
                    onChange={handleProductChange}
                    primaryColor={"blue"}
                    placeholder={
                      <div className="flex items-center justify-center">
                        {/* Add icon if needed */}
                        <span className="mr-2">🔍</span>
                        <span>Select Product</span>
                      </div>
                    }
                    classNames={{
                      control: () => "flex items-center justify-center", // This centers the text in the control
                      valueContainer: "flex items-center justify-center", // This centers the selected value
                    }}
                    options={[
                      { value: "all", label: "All Products" }, // Hardcoded option
                      ...AllProduct.map((p) => ({
                        value: p._id,
                        label: p.name,
                      })),
                    ]}
                  />
                  {productError && (
                    <p className="text-red-500 text-sm mt-1">{productError}</p>
                  )}
                </div>

                <div className="flex gap-1 mt-5">
                  <div className="w-1/2">
                    {/* Customer Eligibility */}
                    <span className="block text-base font-medium text-gray-700 ml-3">
                      Customer Eligibility:
                    </span>
                    <div className="ml-3 mt-2">
                      <Select
                        isSearchable
                        value={
                          eligibility
                            ? { value: eligibility, label: eligibility }
                            : null
                        }
                        onChange={handleEligibilityChange}
                        primaryColor={"blue"}
                        placeholder={
                          <div className="flex items-center justify-center">
                            {/* Add icon if needed */}
                            <span className="mr-2">🔍</span>
                            <span>Select Eligibility</span>
                          </div>
                        }
                        classNames={{
                          control: () => "flex items-center justify-center", // This centers the text in the control
                          valueContainer: "flex items-center justify-center", // This centers the selected value
                        }}
                        options={[
                          { value: "All Customers", label: "All Customers" },
                          {
                            value: "Loyalty Customers",
                            label: "Loyalty Customers",
                          },
                        ]}
                      />
                      {eligibilityError && (
                        <p className="text-red-500 text-sm mt-1">
                          {eligibilityError}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="w-1/2">
                    <span className="block text-base font-medium text-gray-700 ml-3">
                      Discount Percentage:
                    </span>
                    <Input
                      type="number"
                      placeholder="Enter promotion percentage"
                      value={promotionPercentage}
                      onChange={(e) => {
                        const value = Math.max(
                          0,
                          Math.min(100, Number(e.target.value))
                        ); // Ensure value is between 0 and 100
                        setPromotionPercentage(value);
                      }}
                      onBlur={handlePromoPercentageBlur}
                      style={{ width: "97%" }}
                      className="!border !border-gray-300 mx-3 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:ring-gray-900/10"
                      labelProps={{ className: "hidden" }}
                      containerProps={{ className: "min-w-[100px]" }}
                    />
                    {promotionPercentageError && (
                      <p className="text-red-500 text-sm ml-3 mt-1">
                        {promotionPercentageError}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mx-3 mt-5">
                  <div className="w-1/2">
                    <span className="block text-base font-medium text-gray-700">
                      Start Date:
                    </span>
                    <Input
                      type="date"
                      labelProps={{ className: "hidden" }}
                      value={startDate}
                      onChange={handleStartDateChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="!border !border-gray-300 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:ring-gray-900/10"
                    />
                    {startDateError && (
                      <p className="text-red-500 text-sm">{startDateError}</p>
                    )}
                  </div>

                  <div className="w-1/2">
                    <span className="block text-base font-medium text-gray-700">
                      End Date:
                    </span>
                    <Input
                      type="date"
                      labelProps={{ className: "hidden" }}
                      value={endDate}
                      onChange={handleEndDateChange}
                      className="!border !border-gray-300 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:ring-gray-900/10"
                    />
                    {endDateError && (
                      <p className="text-red-500 text-sm">{endDateError}</p>
                    )}
                  </div>
                </div>

                {/* Promotion Description */}
                <span className="block text-base font-medium text-gray-700 ml-3 mt-5">
                  Promotion Description:
                </span>
                <Textarea
                  placeholder="Enter promotion description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={handlePromoDesBlur}
                  style={{ width: "97%" }}
                  className="!border !border-gray-300 mx-3 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:ring-gray-900/10"
                  labelProps={{ className: "hidden" }}
                  containerProps={{ className: "min-w-[100px]" }}
                />
                {promotionDesError && (
                  <p className="text-red-500 text-sm ml-3 mt-1">
                    {promotionDesError}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="w-2/5">
            <div className="relative w-full mt-5 flex left-1">
              <div className=" mr-2 w-4/5">
                <div className="relative w-full flex flex-col flex-auto min-w-0 p-4 mx-6 text-left break-words bg-white border-0 dark:bg-slate-850 dark:shadow-dark-xl shadow-3xl rounded-2xl bg-clip-border">
                  <div className="flex flex-wrap -mx-3">
                    <div className="flex-none w-auto max-w-full px-3 my-auto">
                      <div className="h-full">
                        <h5 className="mb-3 ml-3 text-black font-semibold text-lg text-center">
                          Optionals
                        </h5>
                      </div>
                    </div>
                  </div>
                  {/* Minimum Purchase Requirement */}
                  <span className="block text-base font-medium text-gray-700 ml-3 mt-5">
                    Minimum Purchase (Optional):
                  </span>
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
                  <span className="block text-base font-medium text-gray-700 ml-3 mt-5">
                    Maximum Discount (Optional):
                  </span>
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

                  <span className="block text-base font-medium text-gray-700 ml-3 mt-5">
                    Promotion Photos:{" "}
                  </span>
                  <div className="border-dashed border-2 border-gray-300 p-4 rounded-lg">
                    <div className="border-dashed border-2 border-gray-300 p-4 rounded-lg">
                      <div className="flex space-x-4 overflow-x-auto">
                        {loading && (
                          <div className="w-36 h-36 flex items-center justify-center bg-gray-200 rounded-lg">
                            <p className="text-center text-lg text-black">
                              {progress}%
                            </p>
                          </div>
                        )}
                        {!loading &&
                          downloadURLs.map((fileData, index) => (
                            <div
                              key={index}
                              className="relative w-36 h-36 flex-shrink-0"
                            >
                              <img
                                src={fileData}
                                alt={`Promotion ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <button
                                onClick={() => handleDelete(fileData, index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-700 focus:outline-none"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
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
                            </div>
                          ))}
                        {downloadURLs.length === 0 && !loading && (
                          <>
                            <div className="w-36 h-36 flex items-center justify-center bg-gray-200 rounded-lg">
                              <p className="text-center text-lg text-black">
                                Add media
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="mt-4">
                      <ImageUpload
                        setDownloadURLs={setDownloadURLs}
                        setProgress={setProgress}
                        setLoading={setImageUploading}
                        update
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdatePromotion;

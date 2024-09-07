import { GoTriangleRight } from "react-icons/go";
import { LuScanLine } from "react-icons/lu";
import { RiAiGenerate } from "react-icons/ri";
import { Input, Textarea } from "@material-tailwind/react";
import Select from "react-tailwindcss-select";
import { useEffect, useState } from "react";
import BarcodeScannerComponent from "../../components/BarcodeScannerComponent";
import ImageUpload from "../../components/ImageUpload";
import axios from "axios";
import { deleteObject } from "firebase/storage";

const AddProduct = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cate, setCate] = useState(null);
  const [disc, setDisc] = useState(null);
  const [progress, setProgress] = useState(0);
  const [downloadURLs, setDownloadURLs] = useState([]);
  const [tagsModal, setTagsModal] = useState(false); // Tag modal visibility
  const [newTagInput, setNewTagInput] = useState();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    imageUrl: [""],
    basePrice: "",
    discountPercentage: "",
    discountType: "",
    sku: "",
    barcode: "",
    quantity: "",
    category: "",
    tags: [],
  });
  const [errors, setErrors] = useState({});

  const handleDropdown = (value) => {
    setCate(value);
    setFormData({ ...formData, ["category"]: value.value });
  };

  const isProductNameUnique = (name) => {
    return !products.includes(name.trim().toLowerCase());
  };

  const handleDropdownDiscount = (value) => {
    setDisc(value);
    setFormData({ ...formData, ["discountType"]: value.value });
  };

  const handleUpdate = (text, result) => {
    setFormData({ ...formData, ["barcode"]: text });
    console.log("Barcode Result:", result);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Perform real-time validation for individual fields
    switch (name) {
      case "productName":
        if (!value) {
          setErrors((prev) => ({
            ...prev,
            productName: "Product name is required",
          }));
        } else if (!isProductNameUnique(value)) {
          setErrors((prev) => ({
            ...prev,
            productName:
              "Product name already exists. Please choose a different name.",
          }));
        } else {
          setErrors((prev) => ({ ...prev, productName: "" }));
        }
        break;
      case "description":
        if (!value) {
          setErrors((prev) => ({
            ...prev,
            description: "Description is required",
          }));
        } else {
          setErrors((prev) => ({ ...prev, description: "" }));
        }
        break;
      case "basePrice":
        if (!value || isNaN(value) || value <= 0) {
          setErrors((prev) => ({
            ...prev,
            basePrice: "Valid base price is required",
          }));
        } else {
          setErrors((prev) => ({ ...prev, basePrice: "" }));
        }
        break;
      case "discountPercentage":
        if (value < 0 || value > 100) {
          setErrors((prev) => ({
            ...prev,
            discountPercentage: "Discount percentage must be between 0 and 100",
          }));
        } else {
          setErrors((prev) => ({ ...prev, discountPercentage: "" }));
        }
        break;
      case "quantity":
        if (!value || isNaN(value) || value <= 0) {
          setErrors((prev) => ({
            ...prev,
            quantity: "Valid quantity is required",
          }));
        } else {
          setErrors((prev) => ({ ...prev, quantity: "" }));
        }
        break;
      default:
        break;
    }
  };

  const GenerateSKU = () => {
    // Generate a SKU using the first 3 letters of the category and a random number
    const categoryPrefix = formData.category
      ? formData.category.substring(0, 3).toUpperCase()
      : "GEN"; // Default to "GEN" if no category is selected
    const randomNumber = Math.floor(Math.random() * 1000000);
    const generatedSKU = `${categoryPrefix}-${randomNumber}`;
    setFormData({ ...formData, sku: generatedSKU });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.productName) {
      newErrors.productName = "Product name is required";
    } else if (!isProductNameUnique(formData.productName)) {
      newErrors.productName =
        "Product name already exists. Please choose a different name.";
    }

    if (!formData.description)
      newErrors.description = "Description is required";

    if (
      !formData.basePrice ||
      isNaN(formData.basePrice) ||
      formData.basePrice <= 0
    ) {
      newErrors.basePrice = "Valid base price is required";
    }

    if (
      formData.discountPercentage &&
      (formData.discountPercentage < 0 || formData.discountPercentage > 100)
    ) {
      newErrors.discountPercentage =
        "Discount percentage must be between 0 and 100";
    }

    if (
      !formData.quantity ||
      isNaN(formData.quantity) ||
      formData.quantity <= 0
    ) {
      newErrors.quantity = "Valid quantity is required";
    }

    if (!formData.category) newErrors.category = "Product category is required";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const productData = {
      ...formData,
      imageUrl: downloadURLs,
    };

    console.log("Submitting data:", productData);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    axios
      .post("http://localhost:5000/product/products", productData)
      .then((res) => {
        console.log(res.message);
        alert("Product Successfully Added!");
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const handleAddTag = () => {
    if (newTagInput.trim()) {
      // Split the input by spaces and prepend "#" to each word
      const newTags = newTagInput
        .split(" ")
        .map((word) => `#${word.trim()}`)
        .filter((tag) => tag.length > 1); // Ensure empty strings are not added

      setFormData((prevState) => ({
        ...prevState,
        tags: [...prevState.tags, ...newTags], // Add new tags to the existing ones
      }));
      setNewTagInput(""); // Clear the input field
      setTagsModal(false); // Close the modal
    }
  };

  const removeTag = (indexToRemove) => {
    setFormData((prevState) => ({
      ...prevState,
      tags: prevState.tags.filter((_, index) => index !== indexToRemove),
    }));
  };
  useEffect(() => {
    axios
      .get("http://localhost:5000/product/products")
      .then((response) => {
        setProducts(response.data);
        console.log(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleDelete = (imageRef, index) => {
    if (!imageRef) {
      console.error("Invalid image reference");
      return;
    }

    deleteObject(imageRef)
      .then(() => {
        setDownloadURLs((prevURLs) => prevURLs.filter((_, i) => i !== index));
        console.log("Image deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting image:", error);
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
                  ADD PRODUCT
                </h5>
                <p className="ml-3 font-semibold leading-normal dark:text-black dark:opacity-60 text-sm flex items-center">
                  <span className="text-blue-300">Dashboard</span>
                  <span className="mx-2" style={{ color: "black" }}>
                    <GoTriangleRight />
                  </span>
                  <span className="text-blue-300">Product List</span>
                  <span className="mx-2" style={{ color: "black" }}>
                    <GoTriangleRight />
                  </span>
                  <span className="text-blue-gray-300">Add Product</span>
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
                    >
                      Discard Changes
                    </button>
                  </li>
                  <li className="z-30 flex-auto text-center">
                    <button
                      onClick={handleSubmit}
                      className="select-none bg-blue-800 rounded-lg border border-blue-800 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                      type="button"
                    >
                      Add Product
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full mx-36 mt-5 flex">
        <div className="w-4/6 mr-2">
          {" "}
          <div className="relative flex flex-col flex-auto min-w-0 p-4 mx-6 text-left overflow-hidden break-words bg-white border-0 dark:bg-slate-850 dark:shadow-dark-xl shadow-3xl rounded-2xl bg-clip-border">
            <div className="flex flex-wrap -mx-3">
              <div className="flex-none w-auto max-w-full px-3 my-auto">
                <div className="h-full">
                  <h5 className="mb-1 ml-3 text-black font-semibold text-lg text-left">
                    General Information
                  </h5>
                </div>
              </div>
            </div>
            <span className="block text-sm font-medium text-gray-700 ml-3">
              Product Name :
            </span>
            <Input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="Enter product name"
              style={{ width: "97%" }}
              className="!border !border-gray-300 mx-3 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
              labelProps={{
                className: "hidden",
              }}
              containerProps={{ className: "min-w-[100px]" }}
            />
            {errors.productName && (
              <p className="text-red-500 text-sm ml-3">{errors.productName}</p>
            )}
            <span className="block text-sm font-medium text-gray-700 ml-3 mt-5">
              Description :
            </span>

            <Textarea
              className="!border !border-gray-300 mx-3 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
              style={{ width: "97%" }}
              name="description"
              value={formData.description}
              onChange={handleChange}
              variant="outlined"
              labelProps={{
                className: "hidden",
              }}
              placeholder="Description for the product"
              rows={3}
            />
            {errors.description && (
              <p className="text-red-500 text-sm ml-3">{errors.description}</p>
            )}
          </div>
        </div>

        <div className="w-2/6">
          <div className="relative flex flex-col flex-auto min-w-0 p-4  overflow-hidden break-words bg-white border-0 dark:bg-slate-850 dark:shadow-dark-xl shadow-3xl rounded-2xl bg-clip-border">
            <div className="flex flex-wrap -mx-3">
              <div className="flex-none w-auto max-w-full px-3 my-auto">
                <div className="h-full">
                  <h5 className="mb-1 ml-3 text-black font-semibold text-lg text-left">
                    Product Media
                  </h5>
                </div>
              </div>
            </div>
            <span className="block text-sm font-medium text-gray-700 text-left ml-3">
              Photo product{" "}
            </span>
            <div className="border-dashed border-2 border-gray-300 p-4 rounded-lg">
              <div className="border-dashed border-2 border-gray-300 p-4 rounded-lg">
                <div className="flex space-x-4 overflow-x-auto w-full">
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
                          src={fileData.url}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleDelete(fileData.ref, index)}
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
                  s
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
                  setLoading={setLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full mx-36 mt-5 flex">
        <div className="w-4/6 mr-2 -mt-20">
          {" "}
          <div className="relative flex flex-col flex-auto min-w-0 p-4 mx-6 break-words bg-white border-0 dark:bg-slate-850 dark:shadow-dark-xl shadow-3xl rounded-2xl bg-clip-border">
            <div className="flex flex-wrap -mx-3">
              <div className="flex-none w-auto max-w-full px-3 my-auto">
                <div className="h-full">
                  <h5 className="mb-1 ml-3 text-black font-semibold text-lg text-left">
                    Pricing
                  </h5>
                </div>
              </div>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-700 text-left ml-3">
                Base Price :
              </span>
              <Input
                type="number"
                style={{ width: "97%" }}
                name="basePrice"
                value={formData.basePrice}
                onChange={handleChange}
                className="!border !border-gray-300 mx-3 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                labelProps={{
                  className: "hidden",
                }}
                containerProps={{ className: "min-w-[100px]" }}
              />
              {errors.basePrice && (
                <p className="text-red-500 text-left mt-3 text-sm ml-3">
                  {errors.basePrice}
                </p>
              )}
            </div>
            <div className="flex flex-wrap mt-3">
              <div className="flex-1 text-left">
                <span className="block text-sm font-medium text-gray-700 ml-3 mt-5">
                  Discount Percentage %
                </span>
                <Input
                  type="number"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleChange}
                  style={{ width: "95%" }}
                  className="!border !border-gray-300 mx-3 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                  labelProps={{
                    className: "hidden",
                  }}
                  containerProps={{ className: "min-w-[100px]" }}
                />
                {errors.discountPercentage && (
                  <p className="text-red-500 text-sm ml-3">
                    {errors.discountPercentage}
                  </p>
                )}
              </div>
              <div className="flex-1 text-left">
                <span className="block text-sm font-medium text-gray-700 ml-3 mt-5">
                  Discount Type
                </span>
                <div
                  style={{ width: "94%" }}
                  className="flex w-72 flex-col gap-6 ml-3"
                >
                  <Select
                    isSearchable
                    value={disc}
                    primaryColor={"red"}
                    onChange={handleDropdownDiscount}
                    options={[
                      {
                        value: "Coupon",
                        label: "Coupon",
                      },
                      {
                        value: "Offer",
                        label: "Offer",
                      },
                      {
                        value: "Seasonal or Holiday",
                        label: "Seasonal or Holiday",
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-2/6 -mt-2">
          <div className="relative flex flex-col flex-auto min-w-0 p-4 break-words bg-white border-0 dark:bg-slate-850 dark:shadow-dark-xl shadow-3xl rounded-2xl bg-clip-border">
            <div className="flex flex-wrap -mx-3">
              <div className="flex-none w-auto max-w-full px-3 my-auto">
                <div className="h-full">
                  <h5 className="mb-1 ml-3 text-black font-semibold text-lg text-left">
                    Category
                  </h5>
                </div>
              </div>
            </div>
            <span className="block text-sm font-medium text-gray-700 text-left ml-3">
              Product Category{" "}
            </span>
            <div className="flex-1 text-left">
              <div
                style={{ width: "94%" }}
                className="flex w-72 flex-col gap-6 ml-3"
              >
                <Select
                  isSearchable
                  value={cate}
                  primaryColor={"red"}
                  onChange={handleDropdown}
                  options={[
                    {
                      value: "Fruits",
                      label: "Fruits",
                    },
                    {
                      value: "Vegetable",
                      label: "Vegetable",
                    },
                    {
                      value: "Dairy",
                      label: "Dairy",
                    },
                    {
                      value: "Meat",
                      label: "Meat",
                    },
                    {
                      value: "Beverage",
                      label: "Beverage",
                    },
                    {
                      value: "Snacks",
                      label: "Snacks",
                    },
                    {
                      value: "Pantry Staples",
                      label: "Pantry Staples",
                    },
                    {
                      value: "Household Goods",
                      label: "Household Goods",
                    },
                  ]}
                />
                {errors.category && (
                  <p className="text-red-500 text-sm ml-3">{errors.category}</p>
                )}
              </div>
            </div>
            <span className="block text-sm font-medium text-gray-700 text-left ml-3">
              Product tags
            </span>
            <div className="flex flex-wrap space-x-2 mt-2 ml-3 max-h-24 overflow-y-auto">
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="px-3 py-1 text-sm text-white bg-blue-500 rounded-full">
                    {tag}
                  </span>
                  <button
                    className="bg-red-300 hover:bg-red-500 text-white font-bold py-1 px-2 border-b-2 border-red-500 hover:border-red-700 rounded text-xs"
                    onClick={() => removeTag(index)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button
                className="select-none bg-opacity-25 bg-yellow-700 rounded-lg border border-yellow-700 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-red-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
                onClick={() => setTagsModal(true)}
              >
                Add Tags
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full ml-36 pr-2 mt-10 flex">
        <div className="w-4/6 mr-2 -mt-16 mb-3">
          {" "}
          <div className="relative flex flex-col flex-auto min-w-0 p-4 mx-6 overflow-hidden break-words bg-white border-0 dark:bg-slate-850 dark:shadow-dark-xl shadow-3xl rounded-2xl bg-clip-border">
            <div className="flex flex-wrap -mx-3">
              <div className="flex-none w-auto max-w-full px-3 my-auto">
                <div className="h-full">
                  <h5 className="mb-1 ml-3 text-black font-semibold text-lg text-left">
                    Inventory
                  </h5>
                </div>
              </div>
            </div>
            <div
              className="grid grid-cols-3 gap-4 text-left"
              style={{ width: "98%" }}
            >
              <div className="ml-3">
                <label className="block text-sm font-medium text-gray-700">
                  SKU
                  <button
                    className="ml-2 bg-deep-orange-500 opacity-50 text-white px-1 py-1  rounded-lg"
                    onClick={GenerateSKU}
                  >
                    <RiAiGenerate />
                  </button>
                </label>
                <Input
                  type="text"
                  name="sku"
                  placeholder="Enter SKU or generate"
                  value={formData.sku}
                  onChange={handleChange}
                  className="!border !border-gray-300 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                  labelProps={{
                    className: "hidden",
                  }}
                  containerProps={{ className: "min-w-[100px]" }}
                />
              </div>
              <div className="ml-3">
                <label className="block text-sm font-medium text-gray-700">
                  Barcode{" "}
                  <button
                    className="ml-2 bg-deep-orange-500 opacity-50 text-white px-1 py-1  rounded-lg"
                    onClick={() => setShowModal(true)}
                  >
                    <LuScanLine />
                  </button>
                </label>
                <Input
                  type="number"
                  value={formData.barcode}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      ["barcode"]: event.target.value,
                    })
                  }
                  placeholder="Enter Barcode or Scan"
                  className="!border !border-gray-300 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                  labelProps={{
                    className: "hidden",
                  }}
                  containerProps={{ className: "min-w-[100px]" }}
                />
              </div>
              <div className="ml-3 mt-1">
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <Input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Enter Barcode or Scan"
                  className="!border !border-gray-300 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                  labelProps={{
                    className: "hidden",
                  }}
                  containerProps={{ className: "min-w-[100px]" }}
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm ml-3">{errors.quantity}</p>
                )}
              </div>
            </div>
          </div>
        </div>
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
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Tag Input Modal */}
      {tagsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg text-deep-orange-600 font-semibold mb-4">
              Add a New Tag
            </h3>
            <Input
              type="text"
              placeholder="Enter tags separated by spaces"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              className="!border !border-gray-300 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
              labelProps={{
                className: "hidden",
              }}
              containerProps={{ className: "min-w-[100px]" }}
            />

            <div className="flex justify-end space-x-4 mt-5">
              <button
                className="bg-gray-300 py-2 px-4 rounded-lg"
                onClick={() => setTagsModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                onClick={handleAddTag} // Add tag on click
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddProduct;

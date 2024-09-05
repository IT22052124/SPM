import { GoTriangleRight } from "react-icons/go";
import { LuScanLine } from "react-icons/lu";
import { RiAiGenerate } from "react-icons/ri";
import { Input, Textarea, Select, Option } from "@material-tailwind/react";
import { useState } from "react";
import BarcodeScannerComponent from "../../components/BarcodeScannerComponent";
import ImageUpload from "../../components/ImageUpload";

const AddProduct = () => {
  const [showModal, setShowModal] = useState(false);
  const [downloadURL, setDownloadURL] = useState("");
  const [barcode, setBarcode] = useState("");

  const handleUpdate = (text, result) => {
    setBarcode(text);

    console.log("Barcode Result:", result);
  };

  const GenerateSKU = () => {};
  return (
    <>
      <div className="relative w-full mx-36 mt-16 ">
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
              placeholder="Enter product name"
              style={{ width: "97%" }}
              className="!border !border-gray-300 mx-3 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
              labelProps={{
                className: "hidden",
              }}
              containerProps={{ className: "min-w-[100px]" }}
            />
            <span className="block text-sm font-medium text-gray-700 ml-3 mt-5">
              Description :
            </span>

            <Textarea
              className="!border !border-gray-300 mx-3 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
              style={{ width: "97%" }}
              variant="outlined"
              labelProps={{
                className: "hidden",
              }}
              placeholder="Description for the product"
              rows={3}
            />
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
              <div className="flex space-x-4 overflow-x-auto">
                <img
                  src={downloadURL}
                  alt="Product 1"
                  className="w-36 h-36 object-cover rounded-lg flex-shrink-0"
                />
                <img
                  src="https://via.placeholder.com/100"
                  alt="Product 2"
                  className="w-36 h-36 object-cover rounded-lg flex-shrink-0"
                />
                <img
                  src="https://via.placeholder.com/100"
                  alt="Product 3"
                  className="w-36 h-36 object-cover rounded-lg flex-shrink-0"
                />
              </div>
              <div className="mt-4">
                <button
                  className="select-none bg-opacity-25 bg-blue-600 rounded-lg border border-blue-300 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-light-blue-700 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button"
                >
                  Add More Image
                </button>
                <ImageUpload
                  downloadURL={downloadURL}
                  setDownloadURL={setDownloadURL}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full mx-36 mt-5 flex">
        <div className="w-4/6 mr-2 -mt-16">
          {" "}
          <div className="relative flex flex-col flex-auto min-w-0 p-4 mx-6 overflow-hidden break-words bg-white border-0 dark:bg-slate-850 dark:shadow-dark-xl shadow-3xl rounded-2xl bg-clip-border">
            <div className="flex flex-wrap -mx-3">
              <div className="flex-none w-auto max-w-full px-3 my-auto">
                <div className="h-full">
                  <h5 className="mb-1 ml-3 text-black font-semibold text-lg text-left">
                    Pricing
                  </h5>
                </div>
              </div>
            </div>
            <span className="block text-sm font-medium text-gray-700 text-left ml-3">
              Base Price :
            </span>
            <Input
              type="number"
              style={{ width: "97%" }}
              className="!border !border-gray-300 mx-3 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
              labelProps={{
                className: "hidden",
              }}
              containerProps={{ className: "min-w-[100px]" }}
            />
            <div className="flex flex-wrap mt-3">
              <div className="flex-1 text-left">
                <span className="block text-sm font-medium text-gray-700 ml-3 mt-5">
                  Discount Percentage %
                </span>
                <Input
                  type="number"
                  style={{ width: "95%" }}
                  className="!border !border-gray-300 mx-3 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                  labelProps={{
                    className: "hidden",
                  }}
                  containerProps={{ className: "min-w-[100px]" }}
                />
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
                    size="lg"
                    labelProps={{
                      className: "hidden",
                    }}
                  >
                    <Option>Coupon</Option>
                    <Option>Offer</Option>
                    <Option>Seasonal or Holiday</Option>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-2/6 -mt-2">
          <div className="relative flex flex-col flex-auto min-w-0 p-4  overflow-hidden break-words bg-white border-0 dark:bg-slate-850 dark:shadow-dark-xl shadow-3xl rounded-2xl bg-clip-border">
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
                  size="lg"
                  labelProps={{
                    className: "hidden",
                  }}
                >
                  <Option>Material Tailwind HTML</Option>
                  <Option>Material Tailwind React</Option>
                  <Option>Material Tailwind Vue</Option>
                  <Option>Material Tailwind Angular</Option>
                  <Option>Material Tailwind Svelte</Option>
                </Select>
              </div>
            </div>
            <span className="block text-sm font-medium text-gray-700 text-left ml-3">
              Product tags
            </span>
            <div className="mt-4">
              <button
                className="select-none bg-opacity-25 bg-yellow-700 rounded-lg border border-yellow-700 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-red-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
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
                  placeholder="Enter SKU or generate"
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
                  value={barcode}
                  onChange={(event) => setBarcode(event.target.value)}
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
                  placeholder="Enter Barcode or Scan"
                  className="!border !border-gray-300 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                  labelProps={{
                    className: "hidden",
                  }}
                  containerProps={{ className: "min-w-[100px]" }}
                />
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
    </>
  );
};

export default AddProduct;

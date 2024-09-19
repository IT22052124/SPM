import { GrUpdate } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import axios from "axios";
import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ProductListView = ({ item, index, setReload }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleMouseMove = (e) => {
    const { left, width } = e.target.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const sectionWidth = width / item.imageUrl.length;
    const newIndex = Math.floor(mouseX / sectionWidth);
    if (newIndex == -1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(newIndex);
    }
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:5000/product/products/${item._id}`);
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
        setReload((reload) => reload + 1);
      }
    });
  };

  const datePart = item.createdAt.split("T")[0];
  const timePart = item.createdAt.split("T")[1].split(".")[0];
  console.log(index);
  return (
    <>
      <div className="bg-white mx-auto border-gray-500 border rounded-xl text-gray-700 mb-0.5">
        <div
          className={`flex p-3 border-l-8 bg-white ${
            index % 3 === 0
              ? "border-red-500"
              : index % 3 === 1
              ? "border-green-500"
              : index % 3 === 2
              ? "border-yellow-400"
              : ""
          }`}
        >
          <div className="space-y-1 border-r-2 pr-3 text-left">
            <div className="text-sm leading-5 font-semibold">
              <span className="text-xs leading-4 font-normal text-gray-500">
                Product ID #
              </span>{" "}
              {item.ID}
            </div>
            <div className="text-sm leading-5 font-semibold">
              <span className="text-xs leading-4 font-normal text-gray-500">
                SKU #
              </span>{" "}
              {item.SKU}
            </div>
            <div className="text-sm leading-5 font-semibold">
              <span className="text-xs leading-4 font-normal text-gray-500">
                Barcode #
              </span>{" "}
              {item.Barcode}
            </div>
            <div className="text-sm leading-5 font-semibold">
              <span className="text-xs leading-4 font-normal text-gray-500">
                Created At #
              </span>{" "}
              <div className="text-sm leading-5 font-semibold">{datePart}</div>
              <div className="text-sm leading-5 font-semibold">{timePart}</div>
            </div>
          </div>
          <div className="space-y-1 border-r-2 pr-3 flex items-center ">
            <div
              className="slider-container h-44 w-44"
              onMouseMove={handleMouseMove}
            >
              {item.imageUrl && item.imageUrl.length > 0 ? (
                <img
                  className={`w-full h-full object-cover rounded-md}`}
                  src={item.imageUrl[currentIndex]}
                  alt={`Slide ${currentIndex + 1}`}
                />
              ) : (
                <>
                  <div>No image Available</div>
                </>
              )}
              <div className="dots">
                {item.imageUrl.length <= 1 ? (
                  <></>
                ) : (
                  item.imageUrl.map((_, index) => (
                    <span
                      key={index}
                      className={`dot ${
                        currentIndex === index ? "active" : ""
                      }`}
                    ></span>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="ml-3 space-y-1 border-r-2 pr-3">
              <div className="font-bold leading-6 ">{item.name}</div>
              <div className="text-sm leading-4 font-normal text-left text-blue-600">
                <span className="text-xs leading-4 font-normal ">Category</span>
                {" : "}
                {item.Category}
              </div>
              <div className="text-sm leading-4 font-normal text-deep-orange-400 text-left">
                <span className="text-xs leading-4 font-normal ">
                  Description :
                </span>{" "}
                {item.Description}
              </div>
            </div>
          </div>
          <div className="border-r-2 pr-3 flex items-center">
            <div className="ml-3 my-3 border-gray-200 border-2 bg-gray-300 p-1">
              <div className="uppercase text-xs leading-4 font-medium">
                Quantity
              </div>
              <div className="text-center text-sm leading-4 font-semibold text-gray-800">
                {item.Quantity}
              </div>
            </div>
          </div>
          <div className="border-r-2 pr-3 flex items-center">
            <div className="ml-3 my-3 border-gray-200 border-2 bg-gray-300 p-1">
              <div className="uppercase text-xs leading-4 font-medium">
                Price (LKR)
              </div>
              <div className="text-center text-sm leading-4 font-semibold text-gray-800">
                {item.BasePrice}.00
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mx-11">
            <Link to={`update/${item._id}`}>
              <button
                type="button"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Update</span>
                <GrUpdate />
              </button>
            </Link>

            <button
              type="button"
              onClick={handleDelete}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Delete</span>
              <MdDelete />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

ProductListView.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    ID: PropTypes.string.isRequired,
    SKU: PropTypes.string.isRequired,
    Barcode: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    imageUrl: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string.isRequired,
    Category: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    Quantity: PropTypes.number.isRequired,
    BasePrice: PropTypes.number.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  setReload: PropTypes.func.isRequired,
};

export default ProductListView;

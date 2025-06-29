import { GrUpdate } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import axios from "axios";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const PromotionListView = ({ item, index, setReload }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (item.imageUrl && item.imageUrl.length > 1) {
      const interval = setInterval(() => {
        setFade(false);

        setTimeout(() => {
          setCurrentImageIndex((prevIndex) =>
            prevIndex === item.imageUrl.length - 1 ? 0 : prevIndex + 1
          );
          setFade(true);
        }, 500);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [item.imageUrl]);

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
        axios.delete(`http://localhost:5000/promotion/promotions/${item._id}`);
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
        setReload((reload) => reload + 1);
      }
    });
  };

  return (
    <>
      <div className="bg-white mx-auto border-gray-500 border rounded-sm text-gray-700 mb-0.5">
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
                PromoID
              </span>{" "}
              {item.ID}
            </div>
            <div className="text-sm leading-5 font-semibold">
              <span className="text-xs leading-4 font-normal text-gray-500">
                Start Date
              </span>{" "}
              {new Date(item.startDate).toISOString().slice(0, 10)}
            </div>
            <div className="text-sm leading-5 font-semibold">
              <span className="text-xs leading-4 font-normal text-gray-500">
                End Date
              </span>{" "}
              {new Date(item.endDate).toISOString().slice(0, 10)}
            </div>
          </div>
          <div className="space-y-1 border-r-2 pr-3 flex items-center ">
            {item.imageUrl && item.imageUrl.length > 0 ? (
              <img
                className={`w-36 h-36 object-cover rounded-md transition-opacity duration-500 ${
                  fade ? "opacity-100" : "opacity-0"
                }`}
                src={item.imageUrl[currentImageIndex]} // Show the current image based on the index
                alt={item.promotionName}
              />
            ) : (
              <>
                <div>No image Available</div>
              </>
            )}
          </div>
          <div className="flex w-full">
            <div className="basis-[60%] pr-3">
              <div className="ml-3 space-y-1 border-r-2 pr-3">
                <div className="font-bold leading-6 ">
                  Promo Name : {item.promotionName}
                </div>
                <div className="text-sm leading-4 font-normal text-left text-blue-600">
                  <span className="text-xs leading-4 font-normal ">
                    Description
                  </span>
                  {" : "}
                  <span className="text-deep-orange-800">
                    {item.description}
                  </span>
                </div>
                <div className="text-sm leading-4 font-normal text-blue-600 text-left">
                  <span className="text-xs leading-4 font-normal ">
                    Eligibility Customers
                  </span>
                  {" : "}
                  <span className="text-deep-orange-800">
                    {item.eligibility}
                  </span>
                </div>
                <div className="text-sm leading-4 font-normal text-blue-600 text-left">
                  <span className="text-xs leading-4 font-normal ">
                    Discount Percentage
                  </span>
                  {" : "}
                  <span className="text-deep-orange-800">
                    {item.discPercentage} %
                  </span>
                </div>
                <div className="text-sm leading-4 font-normal text-blue-600 text-left">
                  <span className="text-xs leading-4 font-normal ">
                    Minimum Purchase Amount
                  </span>
                  {" : "}
                  <span className="text-deep-orange-800">
                    {item?.minPurchase ? `RS. ${item.minPurchase}.00` : "N/A"}
                  </span>
                </div>
                <div className="text-sm leading-4 font-normal text-blue-600 text-left">
                  <span className="text-xs leading-4 font-normal ">
                    Maximum Discount Amount
                  </span>
                  {" : "}
                  <span className="text-deep-orange-800">
                    {item?.maxDiscount ? `RS. ${item.maxDiscount}.00` : "N/A"}
                  </span>
                </div>
              </div>
            </div>
            <div className="basis-[40%]  pr-3">
              <div className="ml-3 space-y-1 border-r-2 pr-3">
                <div className="font-bold leading-6 ">Product Details</div>
                <div className="text-sm leading-4 font-normal text-left text-blue-600">
                  <span className="text-xs leading-4 font-normal ">
                    Product Name
                  </span>
                  {" : "}
                  <span className="text-deep-orange-800">{item.product}</span>
                </div>
                <div className="text-sm leading-4 font-normal text-blue-600 text-left">
                  <span className="text-xs leading-4 font-normal ">
                    Product ID
                  </span>
                  {" : "}
                  <span className="text-deep-orange-800">
                    {item?.productID?.ID ? item.productID.ID : "N/A"}
                  </span>
                </div>
                <div className="text-sm leading-4 font-normal text-blue-600 text-left">
                  <span className="text-xs leading-4 font-normal ">
                    Base Price
                  </span>
                  {" : "}
                  <span className="text-deep-orange-800">
                    {item?.productID?.BasePrice
                      ? `RS. ${item.productID.BasePrice}.00`
                      : "N/A"}
                  </span>
                </div>
                <div className="text-sm leading-4 font-normal text-blue-600 text-left">
                  <span className="text-xs leading-4 font-normal ">
                    Category
                  </span>
                  {" : "}
                  <span className="text-deep-orange-800">
                    {item?.productID?.Category
                      ? item.productID.Category
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mx-11">
            <Link to={`update/${item._id}`}>
              <button
                type="button"
                className="rounded-lg p-2 text-gray-500 bg-black hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white hover:border-black border-2"
              >
                <span className="sr-only">Update</span>
                <GrUpdate />
              </button>
            </Link>

            <button
              type="button"
              onClick={handleDelete}
              className="rounded-lg p-2 text-gray-500 bg-black hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white hover:border-black border-2"
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

PromotionListView.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    ID: PropTypes.string.isRequired,
    imageUrl: PropTypes.arrayOf(PropTypes.string).isRequired,
    promotionName: PropTypes.string.isRequired,
    product: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    eligibility: PropTypes.string.isRequired,
    discPercentage: PropTypes.number.isRequired,
    minPurchase: PropTypes.number.isRequired,
    maxDiscount: PropTypes.number.isRequired,
    productID: PropTypes.string.isRequired,
  }).isRequired,
  setReload: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default PromotionListView;

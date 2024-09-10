import axios from "axios";
import { useEffect, useState } from "react";
import { GrUpdate } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ProductCard = ({ item, setReload }) => {
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

  return (
    <div className="relative rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800 w-full m-4">
      <div className="h-44 w-full">
        {item.imageUrl && item.imageUrl.length > 0 ? (
          <img
            className={`w-full h-full object-cover rounded-md transition-opacity duration-500 ${
              fade ? "opacity-100" : "opacity-0"
            }`} // Apply the fade effect
            src={item.imageUrl[currentImageIndex]} // Show the current image based on the index
            alt={item.name}
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center rounded-md">
            <span className="text-gray-700 text-lg font-bold">{item.name}</span>
          </div>
        )}
      </div>

      <div className="pt-4">
        <div className="mb-1 flex flex-col items-center text-center justify-between gap-3">
          <p className="text-base font-semibold leading-tight text-gray-900 hover:underline dark:text-white">
            {item.name}
          </p>
        </div>

        <span className="block text-left rounded bg-primary-100 py-0.5 text-xs font-medium text-blue-800 dark:bg-primary-900 dark:text-primary-300">
          Category: {item.Category}
        </span>

        <div className="mt-1">
          <p className="text-left text-sm font-medium text-gray-900 dark:text-white">
            {item.Description}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xl font-extrabold leading-tight text-gray-900 dark:text-white">
            LKR {item.BasePrice}
          </p>
          <div className="flex items-center gap-1">
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
    </div>
  );
};

ProductCard.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    imageUrl: PropTypes.arrayOf(PropTypes.string).isRequired,
    name: PropTypes.string.isRequired,
    Category: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    BasePrice: PropTypes.number.isRequired,
  }).isRequired,
  setReload: PropTypes.func.isRequired,
};

export default ProductCard;

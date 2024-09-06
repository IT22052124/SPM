import axios from "axios";
import { useEffect } from "react";
import { GrUpdate } from "react-icons/gr";
import { MdDelete } from "react-icons/md";

const PromotionCard = ({ item }) => {
  const handleDelete = () => {
    axios.delete(`http://localhost:5000/promotion/promotions/${item._id}`);
  };

  return (
    <div className="relative rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800 w-full m-4">
      <div className="h-44 w-full">
        <img
          className="w-full h-full object-cover rounded-md"
          src={item.imageUrl[0]}
          alt={item.promotionName}
        />
      </div>

      <div className="pt-4">
        <div className="mb-1 flex flex-col items-center text-center justify-between gap-3">
          <p className="text-base font-semibold leading-tight text-gray-900 hover:underline dark:text-white">
            {item.promotionName}
          </p>
        </div>

        <span className="block text-left rounded bg-primary-100 py-0.5 text-xs font-medium text-blue-800 dark:bg-primary-900 dark:text-primary-300">
          Product: {item.product}
        </span>

        <div className="mt-1">
          <p className="text-left text-sm font-medium text-gray-900 dark:text-white">
            {item.description}
          </p>
        </div>

        <div className="mt-3 flex justify-between gap-3">
          <p style={{fontSize: "13px"}} className="text-start font-medium leading-tight text-gray-900 dark:text-white">
            Start: {item.startDate}
            <br/>
            End: {item.endDate}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Update</span>
              <GrUpdate />
            </button>

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

export default PromotionCard;

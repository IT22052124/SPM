import { GrUpdate } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import axios from "axios";

const ProductListView = ({ item, key, reload, setReload}) => {

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
        setReload(reload => reload + 1);
      }
    });
  };

  // Function to determine color based on status
  const getStatusColor = (status) => {
    if (status / 3 === 0) return "bg-green-500";
    else if (status / 3 === 1) return "bg-red-500";
    else status / 3 === 1;
    return "bg-white";
  };

  // Assign color based on the status prop
  const statusColor = getStatusColor(key);

  const datePart = item.createdAt.split('T')[0];
  const timePart = item.createdAt.split('T')[1].split('.')[0];

  return (
    <>
      <div className="bg-white mx-auto border-gray-500 border rounded-xl text-gray-700 mb-0.5">
        <div className={`flex p-3 border-l-8 ${statusColor}`}>
          <div className="space-y-1 border-r-2 pr-3 text-left">
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
            <div className="text-sm leading-5 font-semibold">{datePart}</div>
            <div className="text-sm leading-5 font-semibold">{timePart}</div>
          </div>
          <div className="space-y-1 border-r-2 pr-3 flex items-center ">
            {item.imageUrl[0] ? (
              <img
                className="w-36 h-36 object-cover rounded-md"
                src={item.imageUrl[0]}
                alt={item.promotionName}
              />
            ) : (
              <>
                <div >No image Available</div>
              </>
            )}
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
                  Description
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
                {item.BasePrice}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mx-11">
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
    </>
  );
};

export default ProductListView;

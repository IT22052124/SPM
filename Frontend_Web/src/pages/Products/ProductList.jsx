import { GoTriangleRight } from "react-icons/go";
import { LuScanLine } from "react-icons/lu";
import { RiAiGenerate } from "react-icons/ri";
import { Input, Textarea } from "@material-tailwind/react";
import Select from "react-tailwindcss-select";
import { useEffect, useState } from "react";
import BarcodeScannerComponent from "../../components/BarcodeScannerComponent";
import ImageUpload from "../../components/ImageUpload";
import axios from "axios";
import ProductCard from "../../components/ProductCard";

const ProductList = () => {
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(0);

  useEffect(
    () => {
      axios
        .get("http://localhost:5000/product/products")
        .then((response) => {
          setData(response.data);
          console.log(response.data);
        })
        .catch((error) => console.error(error));
    },
    reload,
    setReload
  );

  return (
    <>
      <div className="relative w-full mx-36 ">
        <div className="relative flex flex-col flex-auto min-w-0 p-4 ml-6 overflow-hidden break-words bg-white border-0 dark:bg-slate-850 dark:shadow-dark-xl shadow-3xl rounded-2xl bg-clip-border">
          <div className="flex flex-wrap -mx-3">
            <div className="flex-none w-auto max-w-full px-3 my-auto">
              <div className="h-full">
                <h5 className="mb-1 ml-3 text-black font-bold text-xl text-left">
                  Product List
                </h5>
                <p className="ml-3 font-semibold leading-normal dark:text-black dark:opacity-60 text-sm flex items-center">
                  <span className="text-blue-300">Dashboard</span>
                  <span className="mx-2" style={{ color: "black" }}>
                    <GoTriangleRight />
                  </span>
                  <span className="text-blue-gray-300">Product List</span>
                </p>
              </div>
            </div>
            <div className="w-full max-w-full px-3 mx-auto mt-4 sm:my-auto sm:mr-0 md:w-1/2 md:flex-none lg:w-4/12">
              <div className="relative right-0">
                <ul className="relative flex flex-wrap p-1 list-none bg-gray-50 rounded-xl">
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
        <div
          style={{ width: "98%" }}
          className="relative rounded mt-5 ml-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4"
        >
          {data.map((item) => (
            <ProductCard
              key={item._id}
              item={item}
              reload={reload}
              setReload={setReload}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductList;

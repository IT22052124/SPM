import { GoTriangleRight } from "react-icons/go";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "../../components/ProductCard";
import ProductListView from "../../components/ProductListView";
import Loader from "../../components/Loader/Loader";

const ProductList = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [reload, setReload] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isGridView, setIsGridView] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/product/products")
      .then((response) => {
        setData(response.data);
        console.log(response.data);
        setFilteredData(response.data);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, [reload]);

  const handleGridView = () => setIsGridView(true); // Handler to switch to grid view
  const handleListView = () => setIsGridView(false); // Handler to switch to list view

  useEffect(() => {
    reload, setReload;
  }, [reload]);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();

    const filtered = data.filter((item) => {
      const idMatch = item.ID.toLowerCase().includes(lowerCaseQuery);
      const nameMatch = item.name.toLowerCase().includes(lowerCaseQuery);
      const categoriesMatch =
        item.Category.toLowerCase().includes(lowerCaseQuery);
      const tagsMatch = item.tags.some((tag) =>
        tag.toLowerCase().includes(lowerCaseQuery)
      );
      const barcodeMatch = item.Barcode.toLowerCase().includes(lowerCaseQuery);

      return (
        idMatch || nameMatch || categoriesMatch || tagsMatch || barcodeMatch
      );
    });
    setFilteredData(filtered);
  }, [searchQuery, data]);

  return (
    <>
      <div className="h-dvh">
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
              <div className="flex items-center p-6 space-x-6 mx-5">
                <div className="flex bg-gray-100 p-4 w-72 space-x-4 rounded-lg border-2 border-black">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 opacity-30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="black"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    className="bg-gray-100 outline-none text-black"
                    type="text"
                    placeholder="Search By anything ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex py-3 px-4 rounded-lg text-gray-500 font-semibold cursor-pointer">
                  <span>All categories</span>
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
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              <div className="w-full max-w-full px-3 mx-auto mt-4 sm:my-auto sm:mr-0 md:w-1/2 md:flex-none lg:w-4/12">
                <div className="relative right-0">
                  <ul className="relative flex flex-wrap p-1 list-none bg-gray-50 rounded-xl">
                    {/* Button to switch to grid view */}
                    <li>
                      <button
                        onClick={handleGridView}
                        className={`inline-flex items-center transition-colors duration-300 ease-in focus:outline-none hover:text-blue-400 focus:text-blue-400 rounded-l-full px-4 py-2 ${
                          isGridView ? "text-blue-400" : "text-gray-500"
                        }`}
                        id="grid"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="fill-current w-4 h-4 mr-2"
                        >
                          <rect x="3" y="3" width="7" height="7"></rect>
                          <rect x="14" y="3" width="7" height="7"></rect>
                          <rect x="14" y="14" width="7" height="7"></rect>
                          <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                        <span>Grid</span>
                      </button>
                    </li>

                    {/* Button to switch to list view */}
                    <li>
                      <button
                        onClick={handleListView}
                        className={`inline-flex items-center transition-colors duration-300 ease-in focus:outline-none hover:text-blue-400 focus:text-blue-400 rounded-r-full px-4 py-2 ${
                          !isGridView ? "text-blue-400" : "text-gray-500"
                        }`}
                        id="list"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="fill-current w-4 h-4 mr-2"
                        >
                          <line x1="8" y1="6" x2="21" y2="6"></line>
                          <line x1="8" y1="12" x2="21" y2="12"></line>
                          <line x1="8" y1="18" x2="21" y2="18"></line>
                          <line x1="3" y1="6" x2="3.01" y2="6"></line>
                          <line x1="3" y1="12" x2="3.01" y2="12"></line>
                          <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                        <span>List</span>
                      </button>
                    </li>
                    <li className="z-30 flex-auto text-center">
                      <Link to={"add"}>
                        <button
                          className="select-none bg-blue-800 rounded-lg border border-blue-800 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                          type="button"
                        >
                          Add Product
                        </button>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* Conditionally render grid or list view based on `isGridView` */}
          {loading && (
            <div className="h-3/4 pt-96 mt-56">
              <Loader label={"Retrieving ...."} />
            </div>
          )}
{filteredData.length > 0 ?

          isGridView ? (
            <div
              style={{ width: "98%" }}
              className="relative rounded mt-5 ml-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4"
            >
              {filteredData.map((item, index) => (
                <ProductCard
                  key={index}
                  item={item}
                  reload={reload}
                  setReload={setReload}
                />
              ))}
            </div>
          ) : (
            <div
              style={{ width: "98%" }}
              className="relative rounded mt-12 ml-5"
            >
              {filteredData.map((item, index) => (
                <ProductListView
                  key={index}
                  index={index}
                  item={item}
                  setReload={setReload}
                />
              ))}
            </div>
          ) : <>
          <div className="h-full mt-10">
              <span className="text-lg">No Result Found ...💔 </span>
            </div>
          </>}
        </div>
      </div>
    </>
  );
};

export default ProductList;

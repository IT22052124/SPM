import { GoTriangleRight } from "react-icons/go";
import { useEffect, useState } from "react";
import axios from "axios";
import PromotionCard from "../../components/PromotionCard";
import PromotionListView from "../../components/PromotionListView";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader/Loader";

const PromotionList = () => {
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(0);
  const [isGridView, setIsGridView] = useState(true);

  const [loading, setLoading] = useState(false); // State to toggle between grid and list view

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/promotion/promotions")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, [reload]);

  useEffect(() => {
    reload, setReload;
  }, [reload]);

  const handleGridView = () => setIsGridView(true); // Handler to switch to grid view
  const handleListView = () => setIsGridView(false); // Handler to switch to list view

  return (
    <>
      <div className="h-dvh">
        <div className="relative w-full mx-36">
          <div className="relative flex flex-col flex-auto min-w-0 p-4 ml-6 overflow-hidden break-words bg-white border-0 dark:bg-slate-850 dark:shadow-dark-xl shadow-3xl rounded-2xl bg-clip-border">
            <div className="flex flex-wrap -mx-3">
              <div className="flex-none w-auto max-w-full px-3 my-auto">
                <div className="h-full">
                  <h5 className="mb-1 ml-3 text-black font-bold text-xl text-left">
                    Promotion List
                  </h5>
                  <p className="ml-3 font-semibold leading-normal dark:text-black dark:opacity-60 text-sm flex items-center">
                    <span className="text-blue-300">Dashboard</span>
                    <span className="mx-2" style={{ color: "black" }}>
                      <GoTriangleRight />
                    </span>
                    <span className="text-blue-gray-300">Promotion List</span>
                  </p>
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
                          Add Promotion
                        </button>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {loading && (
            <div className="h-3/4 pt-96 mt-56">
              <Loader label={"Retrieving ...."} />
            </div>
          )}
          {isGridView ? (
            <div
              style={{ width: "98%" }}
              className="relative rounded mt-5 ml-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4"
            >
              {data.map((item) => (
                <PromotionCard
                  key={item._id}
                  item={item}
                  setReload={setReload}
                />
              ))}
            </div>
          ) : (
            <div
              style={{ width: "98%" }}
              className="relative rounded mt-12 ml-5"
            >
              {data.map((item, index) => (
                <PromotionListView
                  index={index}
                  key={item._id}
                  item={item}
                  setReload={setReload}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PromotionList;

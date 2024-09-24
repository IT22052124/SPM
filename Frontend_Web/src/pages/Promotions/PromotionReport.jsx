import { useRef, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import ProductReportTable from "../../components/ProductReportTable";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import Toast from "../../components/Toast/Toast";

const PromotionReport = () => {
  const currentDateTime = new Date().toLocaleString();
  const [buttonDisable, setButtonDisable] = useState(false);
  const [sortType, setSortType] = useState("default");
  const [date, setdate] = useState({
    startDate: moment().startOf("month").format("YYYY-MM-DD"),
    endDate: moment().endOf("month").format("YYYY-MM-DD"),
  });

  const handleValueChange = (newValue) => {
    if (newValue.startDate === null || newValue.endDate === null) {
      setdate({
        startDate: moment().startOf("month").format("YYYY-MM-DD"),
        endDate: moment().endOf("month").format("YYYY-MM-DD"),
      });
    } else {
      setdate({
        startDate: moment(newValue.startDate).format("YYYY-MM-DD"), // Convert to string
        endDate: moment(newValue.endDate).format("YYYY-MM-DD"), // Convert to string
      });
    }
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Promotion Report ${currentDateTime}`,
    onAfterPrint: () =>
      Toast("Promotion Report is successfully genrated !", "success"),
  });

  return (
    <>
      <div className="h-dvh">
        <div className="relative w-full mx-36 -mt-3">
          <div className="relative flex flex-col flex-auto min-w-0 p-4 ml-6 break-words bg-white border-0 dark:bg-slate-850 dark:shadow-dark-xl shadow-3xl rounded-2xl bg-clip-border">
            <div className="flex items-center justify-between mt-5 mb-4">
              <div className="flex items-center" id="dateRangePickerId">
                <Datepicker
                  value={date}
                  onChange={handleValueChange}
                  showShortcuts={true}
                />
              </div>
              <div className="flex items-center  text-black ">
                <p>Sort By : </p>
                <button
                  className={`ml-2 py-2 px-4 rounded-lg ${
                    sortType === "default"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setSortType("default")}
                >
                  Default
                </button>
                <button
                  className={`ml-2 py-2 px-4 rounded-lg ${
                    sortType === "highest"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  } mr-2`}
                  onClick={() => setSortType("highest")}
                >
                  Highest Price
                </button>
                <button
                  className={`ml-2 py-2 px-4 rounded-lg ${
                    sortType === "lowest"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  } mr-2`}
                  onClick={() => setSortType("lowest")}
                >
                  Lowest Price
                </button>
              </div>
              <button
                disabled={buttonDisable}
                onClick={handlePrint}
                className={`bg-blue-500 text-white py-2 px-4 rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                  buttonDisable
                    ? "cursor-not-allowed opacity-75 "
                    : "hover:bg-red-300"
                }`}
              >
                Generate Report
              </button>
            </div>
            <ProductReportTable
              date={date}
              componentRef={componentRef}
              sortType={sortType}
              setButtonDisable={setButtonDisable}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PromotionReport;

import PropTypes from "prop-types";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import Loader from "./Loader/Loader";

const ProductReportTable = ({
  date,
  componentRef,
  sortType,
  setButtonDisable,
}) => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentDate = new Date().toLocaleDateString();

  useEffect(() => {
    setLoading(true);
    setButtonDisable(true);
    axios
      .get("http://localhost:5000/product/Report/", {
        params: {
          startDate:
            date.startDate || moment().startOf("month").format("YYYY-MM-DD"),
          endDate: date.endDate || moment().endOf("month").format("YYYY-MM-DD"),
        },
      })
      .then((res) => {
        setDetails(res.data);
        console.log(res.data);
        setLoading(false);
        setButtonDisable(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const sortedDetails = [...details].sort((a, b) => {
    if (sortType === "highest") {
      return b.totalPrice - a.totalPrice; // Sort by highest price
    } else if (sortType === "lowest") {
      return a.totalPrice - b.totalPrice; // Sort by lowest price
    } else {
      return a.ID - b.ID; // Default sorting by Product ID
    }
  });

  const sortedProducts = [...details].sort(
    (a, b) => b.totalPrice - a.totalPrice
  );
  const topProducts = sortedProducts.filter(
    (product) => product.totalPrice === sortedProducts[0].totalPrice
  );

  const totalRecieved = details.reduce(
    (total, product) => total + product.totalPrice,
    0
  );

  return (
    <div className="container mx-auto my-8 text-black text-left">
      <div className="bg-white" ref={componentRef}>
        <div className="m-3 bg-white text-black ">
          <h1 className="text-3xl font-bold mb-2">
            Product Report : {date.startDate}
            {" - "}
            {date.endDate}
          </h1>
          <p className="mb-4">
            <strong>Business Name:</strong> ShopX - On The Way To Home
            <br />
            <strong>Address:</strong> Top flour One Galle Face , Colombo 1 (Near
            To PVR)
            <br />
            <strong>Date:</strong> {currentDate}
          </p>
          <div className="mt-4 w-full min-h-44 overflow-x-scroll md:overflow-auto max-w-7xl 2xl:max-w-none">
            <table
              id="example"
              className="table-auto bg-[#222E3A]/[6%] overflow-scroll md:overflow-auto w-full text-left font-inter border"
            >
              <thead className="rounded-lg text-base text-white font-semibold w-full">
                <tr className="bg-[#222E3A]/[6%]">
                  <th className="py-2 px-2 sm:px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                    No.
                  </th>
                  <th className="py-2 px-2 sm:px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                    Product Id
                  </th>
                  <th className="py-2 px-2 sm:px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                    Product Name
                  </th>
                  <th className="py-2 px-2 text-center sm:px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                    Category
                  </th>
                  <th className="py-2 px-2 sm:px-3 text-center text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                    Unit Sold
                  </th>
                  <th className="py-2 px-2 sm:px-3 text-right text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                    Received (LKR)
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <th colSpan={7}>
                      <center>
                        <Loader label="Loading" color="text-black" />
                      </center>
                    </th>
                  </tr>
                ) : (
                  sortedDetails?.map((data, index) => (
                    <tr
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-[#222E3A]/[6%]"
                      }`}
                      key={index}
                    >
                      <td className="py-1 px-2 sm:px-3 font-normal text-base border-t">
                        {index + 1}
                      </td>
                      <td className="py-1 px-2 sm:px-3 font-normal text-base border-t">
                        {data?.ID}
                      </td>
                      <td className="py-1 px-2 sm:px-3 font-normal text-base border-t">
                        {data?.name}
                      </td>
                      <td className="py-1 px-2 sm:px-3 font-normal text-base text-center border-t">
                        {data?.Category}
                      </td>
                      <td className="py-1 px-2 sm:px-3 font-normal text-base text-center border-t">
                        {data?.totalUnits}
                        {" (" + data.Unit + ")"}
                      </td>
                      <td className="py-1 px-2 sm:px-3 font-normal text-base text-right border-t">
                        {data?.totalPrice}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <h1 className="text-lg ">
              <b>Summary Information:</b>
            </h1>
            <p>
              <b>Total Amount Received : </b>
              LKR {totalRecieved}
            </p>
            <p>
              <b>Total Items : </b>
              {details?.length}
            </p>
            <p>
              <b>Top Product :</b>{" "}
              {topProducts.map((product, index) => (
                <span key={index}>
                  {product.name}
                  {index !== topProducts.length - 1 && ", "}
                </span>
              ))}
            </p>
          </div>
          <div className="mt-8 flex justify-between">
            <div className="text-left ">
              <p>Date of Approval: {currentDate}</p>
            </div>
            <div>
              <p>Signature of Authorized Person</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ProductReportTable.propTypes = {
  date: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }).isRequired,
  componentRef: PropTypes.object,
  sortType: PropTypes.string,
  setButtonDisable: PropTypes.any,
};

export default ProductReportTable;

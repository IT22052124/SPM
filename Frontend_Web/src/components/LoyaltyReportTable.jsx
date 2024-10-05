import PropTypes from "prop-types";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import Loader from "./Loader/Loader";

const LoyaltyReportTable = ({
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
      .get("http://localhost:5000/invoice/")
      .then((res) => {
        setDetails(res.data);
        setLoading(false);
        setButtonDisable(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [date, setButtonDisable]);

  // Grouping logic to aggregate purchases by LoyaltyId
  const groupByLoyaltyId = (data) => {
    const groupedData = data.reduce((acc, current) => {
      const { LoyaltyId, finalTotal, createdAt } = current;

      if (!LoyaltyId) return acc; // Skip if no LoyaltyId

      const loyaltyId = LoyaltyId._id; // Accessing the ID directly
      const customerName = current.LoyaltyName; // Assuming you want to keep the name
      const ID = current.LoyaltyId.ID;
      const phone = current.LoyaltyId.Phone;

      if (!acc[loyaltyId]) {
        // If this LoyaltyId doesn't exist, create an entry
        acc[loyaltyId] = {
          LoyaltyId: loyaltyId,
          name: customerName, // Keep the name for display
          finalTotal: finalTotal || 0, // Initial finalTotal
          count: 1, // Initial count
          ID: ID,
          phone: phone,
        };
      } else {
        // If the LoyaltyId exists, update the totals
        acc[loyaltyId].finalTotal += finalTotal || 0; // Add to the finalTotal
        acc[loyaltyId].count += 1; // Increment the count
      }

      return acc;
    }, {});

    return Object.values(groupedData); // Convert the grouped object into an array
  };

  // Only include records with valid LoyaltyId
  const filteredDetails = details.filter(
    (detail) => detail.CusType === "Loyalty"
  );

  // Filter by date range based on createdAt
  const startDate = moment(date.startDate).startOf("day");
  const endDate = moment(date.endDate).endOf("day");

  const dateFilteredDetails = filteredDetails.filter((detail) => {
    const createdAtDate = moment(detail.createdAt).startOf("day");
    return createdAtDate.isBetween(startDate, endDate, null, "[]"); // Inclusive range
  });

  console.log(dateFilteredDetails);

  // Group the data by LoyaltyId
  const groupedDetails = groupByLoyaltyId(dateFilteredDetails);

  console.log(groupedDetails);

  // Sort the grouped details based on the sortType
  const sortedDetails = [...groupedDetails].sort((a, b) => {
    if (sortType === "highest") {
      return b.finalTotal - a.finalTotal; // Sort by highest final total
    } else if (sortType === "lowest") {
      return a.finalTotal - b.finalTotal; // Sort by lowest final total
    } else {
      return a.ID.localeCompare(b.ID); // Default sort by LoyaltyId
    }
  });

  // Calculate total amount received
  const totalReceived = groupedDetails.reduce(
    (total, customer) => total + customer.finalTotal,
    0
  );

  const topCustomer = groupedDetails.reduce((prev, current) => {
    return prev.finalTotal > current.finalTotal ? prev : current;
  }, groupedDetails[0]);

  return (
    <div className="container mx-auto my-8 text-black text-left">
      <div className="bg-white" ref={componentRef}>
        <div className="m-3 bg-white text-black ">
          <h1 className="text-3xl font-bold mb-2">
            Loyalty Report: {date.startDate} - {date.endDate}
          </h1>
          <p className="mb-4">
            <strong>Business Name:</strong> ShopX - On The Way To Home
            <br />
            <strong>Address:</strong> Top floor One Galle Face, Colombo 1 (Near
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
                    Loyalty ID
                  </th>
                  <th className="py-2 px-2 sm:px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                    Customer Name
                  </th>
                  <th className="py-2 px-2 sm:px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                    Customer Phone
                  </th>
                  <th className="py-2 px-2 text-center sm:px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                    Total Purchases (Count)
                  </th>
                  <th className="py-2 px-2 sm:px-3 text-right text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                    Total Amount (LKR)
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
                  sortedDetails.map((data, index) => (
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
                      <td className="py-1 px-2 sm:px-3 font-normal text-base border-t">
                        {data?.phone}
                      </td>
                      <td className="py-1 px-2 sm:px-3 font-normal text-base text-center border-t">
                        {data?.count}
                      </td>
                      <td className="py-1 px-2 sm:px-3 font-normal text-base text-right border-t">
                        {data?.finalTotal.toFixed(2)}{" "}
                        {/* Ensure two decimal places */}
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
              <b>Total Amount Received: </b>LKR {totalReceived.toFixed(2)}
            </p>
            <p>
              <b>Total Customers: </b>
              {groupedDetails.length}
            </p>
            {topCustomer ? (
              <p>
                <b>Top Customer: </b>
                {topCustomer.ID} - {topCustomer.name} (Phone:{" "}
                {topCustomer.phone}) with Total Purchases: LKR{" "}
                {topCustomer.finalTotal.toFixed(2)}
              </p>
            ) : (
              <p>
                <b>Top Customer: </b> N/A
              </p>
            )}
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

LoyaltyReportTable.propTypes = {
  date: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }).isRequired,
  componentRef: PropTypes.object,
  sortType: PropTypes.string,
  setButtonDisable: PropTypes.any,
};

export default LoyaltyReportTable;

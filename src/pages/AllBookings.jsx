import React, { useEffect, useState } from 'react';
import { FaEye } from "react-icons/fa";
import apiClient from "../api/apiConfig";

const AllBookings = () => {
  const [data, setData] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewMode, setViewMode] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/booking/all");
        setData(response.data);
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
        setStatuses(response.data.map((item) => ({ id: item.bookingId, status: "Active" })));
      } catch (error) {
        console.error("Error fetching booking data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentPage]);

  const filteredData = data.filter((item) =>
    item.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setViewMode(true);
  };

  const handleBack = () => {
    setViewMode(false);
    setSelectedBooking(null);
  };

  return (
    <div className=" bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mt-4 mb-4">
        <h1 className="text-xl font-bold text-gray-800 md:text-2xl">All Bookings</h1>
      </div>

      {viewMode ? (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4 md:text-xl">Booking Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold text-sm">Vehicle Image URL:</label>
              <img src={selectedBooking.vehicleImageUrl} alt="Vehicle" className="mt-3 rounded-md shadow-md h-40 md:h-52 w-full object-cover" />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold text-sm">Booking ID:</label>
              <input
                type="text"
                name="bookingId"
                value={selectedBooking.bookingId}
                className="mt-2 block w-full border bg-gray-200 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-sm"
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold text-sm">Vehicle Name:</label>
              <input
                type="text"
                name="vehicleName"
                value={selectedBooking.vehicle}
                className="mt-2 block w-full border bg-gray-200 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-sm"
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold text-sm">Vehicle Number:</label>
              <input
                type="text"
                name="vehicleNumber"
                value={selectedBooking.vehicleNumber}
                className="mt-2 block w-full border bg-gray-200 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-sm"
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold text-sm">Customer Name:</label>
              <input
                type="text"
                name="customerName"
                value={selectedBooking.customerName}
                className="mt-2 block w-full border bg-gray-200 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-sm"
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold text-sm">Customer Contact Number:</label>
              <input
                type="text"
                name="customerContactNumber"
                value={selectedBooking.customerContactNumber}
                className="mt-2 block w-full border bg-gray-200 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-sm text-red-500"
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold text-sm">Address Type:</label>
              <input
                type="text"
                name="addressType"
                value={selectedBooking.addressType}
                className="mt-2 block w-full border bg-gray-200 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-sm"
                readOnly
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-gray-700 font-semibold text-sm">Address:</label>
              <input
                type="text"
                name="address"
                value={selectedBooking.address}
                className="mt-2 block w-full border bg-gray-200 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-sm"
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold text-sm">Start Date:</label>
              <input
                type="datetime-local"
                name="startDate"
                value={selectedBooking.startDate}
                className="mt-2 block w-full border bg-gray-200 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-sm"
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold text-sm">End Date:</label>
              <input
                type="datetime-local"
                name="endDate"
                value={selectedBooking.endDate}
                className="mt-2 block w-full border bg-gray-200 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-sm"
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold text-sm">Vehicle Package:</label>
              <input
                type="number"
                name="totalRideFare"
                value={selectedBooking.totalRideFare}
                className="mt-2 block w-full border bg-gray-200 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-sm"
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold text-sm">Late Fee Charges:</label>
              <input
                type="number"
                name="lateFeeCharges"
                value={0}
                className="mt-2 block w-full border bg-gray-200 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-sm text-red-500"
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold text-sm">GST 5%:</label>
              <input
                type="number"
                name="gst"
                value={selectedBooking.gst}
                className="mt-2 block w-full border bg-gray-200 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-sm"
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold text-sm">Refundable Deposit Amount:</label>
              <input
                type="number"
                name="refundableDepositAmount"
                value={selectedBooking.refundableDepositAmount}
                className="mt-2 block w-full border bg-gray-200 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-sm"
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold text-sm">Total Amount:</label>
              <input
                type="number"
                name="totalAmount"
                value={selectedBooking.totalAmount}
                className="mt-2 block w-full border bg-gray-200 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-sm"
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold text-sm">Payment Mode:</label>
              <input
                type="text"
                name="paymentMode"
                value={selectedBooking.paymentMode}
                className="mt-2 block w-full border bg-gray-200 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-sm"
                readOnly
              />
            </div>
          </div>

          {/* Before and After Trip Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Before Trip Images</h4>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, index) => (
                  <img
                    key={index}
                    src={`before_trip_image_${index + 1}.jpg`} // Replace with actual image URLs
                    alt={`Before Trip ${index + 1}`}
                    className="rounded-md shadow-md h-40 md:h-52 w-full object-cover"
                  />
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">After Trip Images</h4>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, index) => (
                  <img
                    key={index}
                    src={`after_trip_image_${index + 1}.jpg`} // Replace with actual image URLs
                    alt={`After Trip ${index + 1}`}
                    className="rounded-md shadow-md h-40 md:h-52 w-full object-cover"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* <button
            className="mt-6 px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-600 transition duration-300"
            onClick={handleBack}
          >
            Back
          </button> */}
        </div>
      ) : (
        <div className="bg-white p-4 shadow-md rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search By Vehicle Name..."
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-56 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                <tr>
                  <th scope="col" className="px-4 py-2">S.No.</th>
                  {/* <th scope="col" className="px-4 py-2">User Id</th> */}
                  <th scope="col" className="px-4 py-2">Vehicle</th>
                  <th scope="col" className="px-4 py-2">Start Date</th>
                  <th scope="col" className="px-4 py-2">End Date</th>
                  <th scope="col" className="px-4 py-2">Total Amount</th>
                  <th scope="col" className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  currentData.map((item, index) => (
                    <tr key={item.bookingId} className="bg-white border-b hover:bg-gray-50 transition duration-300">
                      <td className="px-4 py-3">{indexOfFirstItem + index + 1}</td>
                      {/* <td className="px-4 py-3 font-medium text-gray-900">{item.userId}</td> */}
                      <td className="px-4 py-3">{item.vehicle}</td>
                      <td className="px-4 py-3">{item.startDate}</td>
                      <td className="px-4 py-3">{item.endDate}</td>
                      <td className="px-4 py-3">{item.totalAmount}</td>
                      <td className="px-4 py-3 flex space-x-2">
                        <button
                          className="px-3 py-1 flex items-center text-white bg-blue-800 hover:bg-blue-600 rounded-md transition duration-300"
                          onClick={() => handleView(item)}
                        >
                          <FaEye className="mr-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="8" className="px-4 py-3 text-right">
                    <strong>Number of rows: {currentData.length} </strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-500">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
            </p>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 text-sm text-white bg-blue-900 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-300"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === index + 1
                      ? "bg-blue-900 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  } transition duration-300`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-300 text-gray-500"
                    : "bg-blue-900 text-white hover:bg-blue-600"
                } transition duration-300`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBookings;

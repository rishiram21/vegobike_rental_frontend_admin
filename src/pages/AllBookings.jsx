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

  useEffect(() => {
    fetchBookings();
  }, [currentPage]);

  const filteredData = data.filter((item) =>
    item.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const toggleStatus = (id) => {
    setStatuses((prevStatuses) =>
      prevStatuses.map((row) =>
        row.id === id
          ? { ...row, status: row.status === "Active" ? "Inactive" : "Active" }
          : row
      )
    );
  };

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setViewMode(true);
  };

  const handleBack = () => {
    setViewMode(false);
    setSelectedBooking(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen mt-14">
      {viewMode ? (
        <div className="bg-white p-6 rounded shadow-lg">
          <h3 className="text-xl font-bold mb-4">Booking Details</h3>
          <div className="mb-4">
            <strong>Booking ID:</strong> {selectedBooking.bookingId}
          </div>
          <div className="mb-4">
            <strong>User ID:</strong> {selectedBooking.userId}
          </div>
          <div className="mb-4">
            <strong>Vehicle:</strong> {selectedBooking.vehicle}
          </div>
          <div className="mb-4">
            <strong>Start Date:</strong> {selectedBooking.startDate}
          </div>
          <div className="mb-4">
            <strong>End Date:</strong> {selectedBooking.endDate}
          </div>
          <div className="mb-4">
            <strong>Total Amount:</strong> {selectedBooking.totalAmount}
          </div>
          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded shadow-md hover:bg-gray-700"
              onClick={handleBack}
            >
              Back
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">All Booking Requests</h1>
          </div>

          <div className="bg-white p-6 shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                placeholder="Search By Vehicle Name"
                className="border border-gray-300 rounded-lg px-4 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600 border-collapse">
                <thead className="text-xs text-gray-700 uppercase bg-gray-200 border-b">
                  <tr>
                    {[
                      "ID",
                      "User Id",
                      "Vehicle",
                      "Start Date",
                      "End Date",
                      "Total Amount",
                      "Action",
                    ].map((heading) => (
                      <th key={heading} className="px-6 py-3 text-left">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    currentData.map((item) => {
                      const rowStatus = statuses.find((status) => status.id === item.bookingId)?.status;
                      return (
                        <tr key={item.bookingId} className="border-b bg-white hover:bg-gray-50">
                          <td className="px-6 py-4">{item.bookingId}</td>
                          <td className="px-6 py-4 font-medium text-gray-900">{item.userId}</td>
                          <td className="px-6 py-4">{item.vehicle}</td>
                          <td className="px-6 py-4">{item.startDate}</td>
                          <td className="px-6 py-4">{item.endDate}</td>
                          <td className="px-6 py-4">{item.totalAmount}</td>
                          <td className="px-6 py-4 flex space-x-2">
                            <button
                              className="px-4 py-2 flex items-center text-white bg-blue-800 hover:bg-blue-600 rounded"
                              onClick={() => handleView(item)}
                            >
                              <FaEye className="mr-2" />
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-6">
              <p className="text-sm text-gray-500">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
              </p>
              <div className="flex space-x-2">
                <button
                  className="px-4 py-2 text-sm text-white bg-blue-900 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 rounded ${
                      currentPage === index + 1
                        ? "bg-blue-900 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-300 text-gray-500"
                      : "bg-blue-900 text-white hover:bg-blue-600"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AllBookings;

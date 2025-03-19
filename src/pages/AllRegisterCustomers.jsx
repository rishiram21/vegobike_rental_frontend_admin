import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import apiClient from "../api/apiConfig";

const AllRegisterCustomers = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMode, setViewMode] = useState(false);

  // Function to fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/users/all", {
        params: {
          page: currentPage - 1,
          size: itemsPerPage,
        },
      });
      setData(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(
    (item) =>
      item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, itemsPerPage]);

  const handleView = (user) => {
    setSelectedUser(user);
    setViewMode(true);
  };

  const handleBack = () => {
    setViewMode(false);
    setSelectedUser(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen mt-14">
      {viewMode ? (
        <div className="bg-white p-6 rounded shadow-lg">
          <h3 className="text-xl font-bold mb-4">User Details</h3>
          <p><strong>Name:</strong> {selectedUser.name}</p>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Phone Number:</strong> {selectedUser.phoneNumber}</p>
          <p><strong>Aadhar Front Side:</strong></p>
          <img
            src={`data:image/jpeg;base64,${selectedUser.aadharFrontSide}`}
            alt="Aadhar Front Side"
            className="mt-2 border rounded h-48 w-80"
          />
          <p><strong>Aadhar Back Side:</strong></p>
          <img
            src={`data:image/jpeg;base64,${selectedUser.aadharBackSide}`}
            alt="Aadhar Back Side"
            className="mt-2 border rounded h-48 w-80"
          />
          <p><strong>Driving License:</strong></p>
          <img
            src={`data:image/jpeg;base64,${selectedUser.drivingLicense}`}
            alt="Driving License"
            className="mt-2 border rounded h-48 w-80"
          />
          <button
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded shadow-md hover:bg-gray-700"
            onClick={handleBack}
          >
            Back
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">All Users List</h1>
          </div>

          <div className="bg-white p-6 shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search By User Name"
                  className="border border-gray-300 rounded-l px-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                  <tr>
                    <th scope="col" className="px-6 py-3">ID</th>
                    <th scope="col" className="px-6 py-3">Name</th>
                    <th scope="col" className="px-6 py-3">Email</th>
                    <th scope="col" className="px-6 py-3">Phone Number</th>
                    <th scope="col" className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        Loading...
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        No data found
                      </td>
                    </tr>
                  ) : (
                    currentData.map((user) => (
                      <tr
                        key={user.id}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">{user.id}</td>
                        <td className="px-6 py-4">{user.name}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">{user.phoneNumber}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            <button
                              className="px-4 py-2 flex items-center text-white bg-blue-800 hover:bg-blue-600 rounded"
                              onClick={() => handleView(user)}
                            >
                              <FaEye className="mr-2" />
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-6">
              <p className="text-sm text-gray-500">
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, filteredData.length)} of{" "}
                {filteredData.length} entries
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

export default AllRegisterCustomers;

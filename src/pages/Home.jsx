import React, { useEffect, useState } from "react";
import axios from "axios";
import apiClient from "../api/apiConfig"; // Ensure you use the configured Axios instance

const Home = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stores, setStores] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showUsers, setShowUsers] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [showStores, setShowStores] = useState(false);
  const [showBikes, setShowBikes] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/users/all", {
          params: {
            page: currentPage,
            size: 5,
            sortBy: 'id',
            sortDirection: 'asc'
          }
        });
        setUsers(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching users data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchBookings = async () => {
      try {
        const response = await apiClient.get("/booking/all");
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings data:", error);
      }
    };

    const fetchStores = async () => {
      try {
        const response = await apiClient.get("/store/all");
        setStores(response.data.content);
      } catch (error) {
        console.error("Error fetching stores data:", error);
      }
    };

    const fetchBikes = async () => {
      try {
        const response = await apiClient.get("/vehicle/all");
        setBikes(response.data.content);
      } catch (error) {
        console.error("Error fetching bikes data:", error);
      }
    };

    fetchUsers();
    fetchBookings();
    fetchStores();
    fetchBikes();
  }, [currentPage]);

  const stats = [
    { title: "Today's Bookings", count: 1, color: "bg-blue-900" },
    { title: "Ongoing Bookings", count: 3, color: "bg-yellow-400" },
    { title: "Total Bikes", count: bikes.length, color: "bg-red-500" },
    { title: "Total Bookings", count: bookings.length, color: "bg-teal-400" },
    { title: "Total Users", count: users.length, color: "bg-cyan-400" },
    { title: "Total Verified Users", count: users.filter(user => user.isVerified).length, color: "bg-green-400" },
    { title: "Total Unverified Users", count: users.filter(user => !user.isVerified).length, color: "bg-yellow-400" },
    { title: "Total Stores", count: stores.length, color: "bg-red-400" },
  ];

  const handleViewAllUsers = () => {
    setShowUsers(!showUsers);
    setShowBookings(false);
    setShowStores(false);
    setShowBikes(false);
  };

  const handleViewAllBookings = () => {
    setShowBookings(!showBookings);
    setShowUsers(false);
    setShowStores(false);
    setShowBikes(false);
  };

  const handleViewAllStores = () => {
    setShowStores(!showStores);
    setShowUsers(false);
    setShowBookings(false);
    setShowBikes(false);
  };

  const handleViewAllBikes = () => {
    setShowBikes(!showBikes);
    setShowUsers(false);
    setShowBookings(false);
    setShowStores(false);
  };

  const handleViewTodaysBookings = () => {
    // Implement logic to view today's bookings
  };

  const handleViewOngoingBookings = () => {
    // Implement logic to view ongoing bookings
  };

  const handleViewVerifiedUsers = () => {
    // Implement logic to view verified users
  };

  const handleViewUnverifiedUsers = () => {
    // Implement logic to view unverified users
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen mt-16 overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg shadow-md text-white ${stat.color}`}
          >
            <h2 className="text-2xl font-bold sm:text-3xl">{stat.count}</h2>
            <p className="mt-2 text-lg">{stat.title}</p>
            {stat.title === "Total Users" && (
              <button
                className="mt-2 bg-white text-gray-800 py-2 px-4 rounded shadow-md w-full"
                onClick={handleViewAllUsers}
              >
                {showUsers ? "Hide Users" : "View All"}
              </button>
            )}
            {stat.title === "Total Bookings" && (
              <button
                className="mt-2 bg-white text-gray-800 py-2 px-4 rounded shadow-md w-full"
                onClick={handleViewAllBookings}
              >
                {showBookings ? "Hide Bookings" : "View All"}
              </button>
            )}
            {stat.title === "Total Stores" && (
              <button
                className="mt-2 bg-white text-gray-800 py-2 px-4 rounded shadow-md w-full"
                onClick={handleViewAllStores}
              >
                {showStores ? "Hide Stores" : "View All"}
              </button>
            )}
            {stat.title === "Total Bikes" && (
              <button
                className="mt-2 bg-white text-gray-800 py-2 px-4 rounded shadow-md w-full"
                onClick={handleViewAllBikes}
              >
                {showBikes ? "Hide Bikes" : "View All"}
              </button>
            )}
            {stat.title === "Today's Bookings" && (
              <button
                className="mt-2 bg-white text-gray-800 py-2 px-4 rounded shadow-md w-full"
                onClick={handleViewTodaysBookings}
              >
                View All
              </button>
            )}
            {stat.title === "Ongoing Bookings" && (
              <button
                className="mt-2 bg-white text-gray-800 py-2 px-4 rounded shadow-md w-full"
                onClick={handleViewOngoingBookings}
              >
                View All
              </button>
            )}
            {stat.title === "Total Verified Users" && (
              <button
                className="mt-2 bg-white text-gray-800 py-2 px-4 rounded shadow-md w-full"
                onClick={handleViewVerifiedUsers}
              >
                View All
              </button>
            )}
            {stat.title === "Total Unverified Users" && (
              <button
                className="mt-2 bg-white text-gray-800 py-2 px-4 rounded shadow-md w-full"
                onClick={handleViewUnverifiedUsers}
              >
                View All
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Display User Data */}
      {showUsers && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">All Users</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                  <tr>
                    <th scope="col" className="px-4 py-2">ID</th>
                    <th scope="col" className="px-4 py-2">Name</th>
                    <th scope="col" className="px-4 py-2">Email ID</th>
                    <th scope="col" className="px-4 py-2">Contact Number</th>
                    <th scope="col" className="px-4 py-2">Aadhar Front</th>
                    <th scope="col" className="px-4 py-2">Aadhar Back</th>
                    <th scope="col" className="px-4 py-2">Driving License</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{user.id}</td>
                      <td className="px-4 py-3">{user.name}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">{user.phoneNumber}</td>
                      <td className="px-4 py-3">
                        <img
                          src={`data:image/jpeg;base64,${user.aadharFrontSide}`}
                          alt="Aadhar Front"
                          className="w-12 h-12 object-cover"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <img
                          src={`data:image/jpeg;base64,${user.aadharBackSide}`}
                          alt="Aadhar Back"
                          className="w-12 h-12 object-cover"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <img
                          src={`data:image/jpeg;base64,${user.drivingLicense}`}
                          alt="Driving License"
                          className="w-12 h-12 object-cover"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-500">
                  Showing {currentPage * 5 + 1} to {Math.min((currentPage + 1) * 5, users.length)} of {users.length} entries
                </p>
                <div className="flex space-x-2">
                  <button
                    className="px-3 py-1 text-sm text-white bg-blue-900 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`px-3 py-1 rounded ${
                        currentPage === index
                          ? "bg-blue-900 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      onClick={() => setCurrentPage(index)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages - 1}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === totalPages - 1
                        ? "bg-gray-300 text-gray-500"
                        : "bg-blue-900 text-white hover:bg-blue-600"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Display Booking Data */}
      {showBookings && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">All Bookings</h2>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                <tr>
                  <th scope="col" className="px-4 py-2">User ID</th>
                  <th scope="col" className="px-4 py-2">Booking ID</th>
                  <th scope="col" className="px-4 py-2">Vehicle</th>
                  <th scope="col" className="px-4 py-2">Start Date</th>
                  <th scope="col" className="px-4 py-2">End Date</th>
                  <th scope="col" className="px-4 py-2">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((item) => (
                  <tr key={item.bookingId} className="border-b bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.userId}</td>
                    <td className="px-4 py-3">{item.bookingId}</td>
                    <td className="px-4 py-3">{item.vehicle}</td>
                    <td className="px-4 py-3">{item.startDate}</td>
                    <td className="px-4 py-3">{item.endDate}</td>
                    <td className="px-4 py-3">{item.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-500">
                  Showing {currentPage * 5 + 1} to {Math.min((currentPage + 1) * 5, users.length)} of {users.length} entries
                </p>
                <div className="flex space-x-2">
                  <button
                    className="px-3 py-1 text-sm text-white bg-blue-900 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`px-3 py-1 rounded ${
                        currentPage === index
                          ? "bg-blue-900 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      onClick={() => setCurrentPage(index)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages - 1}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === totalPages - 1
                        ? "bg-gray-300 text-gray-500"
                        : "bg-blue-900 text-white hover:bg-blue-600"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
          </div>
        </div>
      )}

      {/* Display Store Data */}
      {showStores && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">All Stores</h2>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                <tr>
                  <th scope="col" className="px-4 py-2">ID</th>
                  <th scope="col" className="px-4 py-2">Store Name</th>
                  <th scope="col" className="px-4 py-2">Location</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr key={store.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{store.id}</td>
                    <td className="px-4 py-3">{store.name}</td>
                    <td className="px-4 py-3">{store.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-500">
                  Showing {currentPage * 5 + 1} to {Math.min((currentPage + 1) * 5, users.length)} of {users.length} entries
                </p>
                <div className="flex space-x-2">
                  <button
                    className="px-3 py-1 text-sm text-white bg-blue-900 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`px-3 py-1 rounded ${
                        currentPage === index
                          ? "bg-blue-900 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      onClick={() => setCurrentPage(index)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages - 1}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === totalPages - 1
                        ? "bg-gray-300 text-gray-500"
                        : "bg-blue-900 text-white hover:bg-blue-600"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
          </div>
        </div>
      )}

      {/* Display Bike Data */}
      {showBikes && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">All Bikes</h2>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                <tr>
                  <th scope="col" className="px-4 py-2">ID</th>
                  <th scope="col" className="px-4 py-2">Vehicle Number</th>
                  <th scope="col" className="px-4 py-2">Model</th>
                </tr>
              </thead>
              <tbody>
                {bikes.map((bike) => (
                  <tr key={bike.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{bike.id}</td>
                    <td className="px-4 py-3">{bike.vehicleRegistrationNumber}</td>
                    <td className="px-4 py-3">{bike.model}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-500">
                  Showing {currentPage * 5 + 1} to {Math.min((currentPage + 1) * 5, users.length)} of {users.length} entries
                </p>
                <div className="flex space-x-2">
                  <button
                    className="px-3 py-1 text-sm text-white bg-blue-900 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`px-3 py-1 rounded ${
                        currentPage === index
                          ? "bg-blue-900 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      onClick={() => setCurrentPage(index)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages - 1}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === totalPages - 1
                        ? "bg-gray-300 text-gray-500"
                        : "bg-blue-900 text-white hover:bg-blue-600"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

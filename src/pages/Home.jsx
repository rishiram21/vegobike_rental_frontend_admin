import React, { useEffect, useState } from "react";
import { useSpring, animated, config } from 'react-spring';
import { useTable } from 'react-table';
import apiClient from "../api/apiConfig";

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
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/users/all", {
          params: { page: currentPage, size: 5, sortBy: 'id', sortDirection: 'asc' }
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Animated counter component
  const AnimatedCounter = ({ value }) => {
    const { number } = useSpring({
      from: { number: 0 },
      number: value,
      delay: 200,
      config: config.molasses,
    });
    
    return <animated.span>{number.to(n => Math.floor(n))}</animated.span>;
  };
  
  // Card entry animation
  const fadeInUp = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 300, friction: 20 },
  });

  // Table entry animation
  const tableAnimation = useSpring({ 
    from: { opacity: 0, transform: 'scale(0.95)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { tension: 280, friction: 18 },
  });

  const Table = ({ columns, data }) => {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

    return (
      <animated.div style={tableAnimation} className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
        <table {...getTableProps()} className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-white uppercase bg-blue-900">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()} className="px-4 py-3">{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="divide-y divide-gray-200">
            {rows.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className={`${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-150`}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()} className="px-4 py-3">{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </animated.div>
    );
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <animated.div 
            key={index} 
            style={{ ...fadeInUp, delay: index * 100 }} 
            className={`p-4 rounded-lg shadow-md text-white ${stat.color} transform transition-all duration-300 hover:scale-105`}
          >
            <h2 className="text-2xl font-bold sm:text-3xl">
              <AnimatedCounter value={stat.count} />
            </h2>
            <p className="mt-2 text-lg font-medium">{stat.title}</p>
            {stat.title === "Total Users" && (
              <button className="mt-2 bg-white text-gray-800 py-2 px-4 rounded shadow-md w-full hover:bg-gray-100 transition-colors duration-150" onClick={handleViewAllUsers}>
                {showUsers ? "Hide Users" : "View All"}
              </button>
            )}
            {stat.title === "Total Bookings" && (
              <button className="mt-2 bg-white text-gray-800 py-2 px-4 rounded shadow-md w-full hover:bg-gray-100 transition-colors duration-150" onClick={handleViewAllBookings}>
                {showBookings ? "Hide Bookings" : "View All"}
              </button>
            )}
            {stat.title === "Total Stores" && (
              <button className="mt-2 bg-white text-gray-800 py-2 px-4 rounded shadow-md w-full hover:bg-gray-100 transition-colors duration-150" onClick={handleViewAllStores}>
                {showStores ? "Hide Stores" : "View All"}
              </button>
            )}
            {stat.title === "Total Bikes" && (
              <button className="mt-2 bg-white text-gray-800 py-2 px-4 rounded shadow-md w-full hover:bg-gray-100 transition-colors duration-150" onClick={handleViewAllBikes}>
                {showBikes ? "Hide Bikes" : "View All"}
              </button>
            )}
            {stat.title === "Today's Bookings" && (
              <button className="mt-2 bg-white text-gray-800 py-2 px-4 rounded shadow-md w-full hover:bg-gray-100 transition-colors duration-150" onClick={handleViewTodaysBookings}>
                View All
              </button>
            )}
            {stat.title === "Ongoing Bookings" && (
              <button className="mt-2 bg-white text-gray-800 py-2 px-4 rounded shadow-md w-full hover:bg-gray-100 transition-colors duration-150" onClick={handleViewOngoingBookings}>
                View All
              </button>
            )}
            {stat.title === "Total Verified Users" && (
              <button className="mt-2 bg-white text-gray-800 py-2 px-4 rounded shadow-md w-full hover:bg-gray-100 transition-colors duration-150" onClick={handleViewVerifiedUsers}>
                View All
              </button>
            )}
            {stat.title === "Total Unverified Users" && (
              <button className="mt-2 bg-white text-gray-800 py-2 px-4 rounded shadow-md w-full hover:bg-gray-100 transition-colors duration-150" onClick={handleViewUnverifiedUsers}>
                View All
              </button>
            )}
          </animated.div>
        ))}
      </div>

      {showUsers && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">All Users</h2>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-900"></div>
            </div>
          ) : (
            <>
              <Table
                columns={[
                  { Header: 'ID', accessor: 'id' },
                  { Header: 'Name', accessor: 'name' },
                  { Header: 'Email ID', accessor: 'email' },
                  { Header: 'Contact Number', accessor: 'phoneNumber' },
                  { Header: 'Aadhar Front', accessor: 'aadharFrontSide', Cell: ({ value }) => <img src={`data:image/jpeg;base64,${value}`} alt="Aadhar Front" className="w-12 h-12 object-cover rounded" /> },
                  { Header: 'Aadhar Back', accessor: 'aadharBackSide', Cell: ({ value }) => <img src={`data:image/jpeg;base64,${value}`} alt="Aadhar Back" className="w-12 h-12 object-cover rounded" /> },
                  { Header: 'Driving License', accessor: 'drivingLicense', Cell: ({ value }) => <img src={`data:image/jpeg;base64,${value}`} alt="Driving License" className="w-12 h-12 object-cover rounded" /> },
                ]}
                data={users}
              />
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-500">
                  Showing {currentPage * 5 + 1} to {Math.min((currentPage + 1) * 5, users.length)} of {users.length} entries
                </p>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm text-white bg-blue-900 rounded disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-150" disabled={currentPage === 0} onClick={() => setCurrentPage((prev) => prev - 1)}>
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button key={index} className={`px-3 py-1 rounded transition-colors duration-150 ${currentPage === index ? "bg-blue-900 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`} onClick={() => setCurrentPage(index)}>
                      {index + 1}
                    </button>
                  ))}
                  <button disabled={currentPage === totalPages - 1} onClick={() => setCurrentPage((prev) => prev + 1)} className={`px-3 py-1 rounded transition-colors duration-150 ${currentPage === totalPages - 1 ? "bg-gray-300 text-gray-500" : "bg-blue-900 text-white hover:bg-blue-600"}`}>
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {showBookings && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">All Bookings</h2>
          <Table
            columns={[
              { Header: 'User ID', accessor: 'userId' },
              { Header: 'Booking ID', accessor: 'bookingId' },
              { Header: 'Vehicle', accessor: 'vehicle' },
              { Header: 'Start Date', accessor: 'startDate' },
              { Header: 'End Date', accessor: 'endDate' },
              { Header: 'Total Amount', accessor: 'totalAmount', Cell: ({ value }) => `₹${value}` },
            ]}
            data={bookings}
          />
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">
              Showing {currentPage * 5 + 1} to {Math.min((currentPage + 1) * 5, bookings.length)} of {bookings.length} entries
            </p>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm text-white bg-blue-900 rounded disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-150" disabled={currentPage === 0} onClick={() => setCurrentPage((prev) => prev - 1)}>
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button key={index} className={`px-3 py-1 rounded transition-colors duration-150 ${currentPage === index ? "bg-blue-900 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`} onClick={() => setCurrentPage(index)}>
                  {index + 1}
                </button>
              ))}
              <button disabled={currentPage === totalPages - 1} onClick={() => setCurrentPage((prev) => prev + 1)} className={`px-3 py-1 rounded transition-colors duration-150 ${currentPage === totalPages - 1 ? "bg-gray-300 text-gray-500" : "bg-blue-900 text-white hover:bg-blue-600"}`}>
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {showStores && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">All Stores</h2>
          <Table
            columns={[
              { Header: 'ID', accessor: 'id' },
              { Header: 'Store Name', accessor: 'name' },
              { Header: 'Location', accessor: 'address' },
            ]}
            data={stores}
          />
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">
              Showing {currentPage * 5 + 1} to {Math.min((currentPage + 1) * 5, stores.length)} of {stores.length} entries
            </p>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm text-white bg-blue-900 rounded disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-150" disabled={currentPage === 0} onClick={() => setCurrentPage((prev) => prev - 1)}>
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button key={index} className={`px-3 py-1 rounded transition-colors duration-150 ${currentPage === index ? "bg-blue-900 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`} onClick={() => setCurrentPage(index)}>
                  {index + 1}
                </button>
              ))}
              <button disabled={currentPage === totalPages - 1} onClick={() => setCurrentPage((prev) => prev + 1)} className={`px-3 py-1 rounded transition-colors duration-150 ${currentPage === totalPages - 1 ? "bg-gray-300 text-gray-500" : "bg-blue-900 text-white hover:bg-blue-600"}`}>
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {showBikes && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">All Bikes</h2>
          <Table
            columns={[
              { Header: 'ID', accessor: 'id' },
              { Header: 'Vehicle Number', accessor: 'vehicleRegistrationNumber' },
              { Header: 'Model', accessor: 'model' },
            ]}
            data={bikes}
          />
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">
              Showing {currentPage * 5 + 1} to {Math.min((currentPage + 1) * 5, bikes.length)} of {bikes.length} entries
            </p>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm text-white bg-blue-900 rounded disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-150" disabled={currentPage === 0} onClick={() => setCurrentPage((prev) => prev - 1)}>
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button key={index} className={`px-3 py-1 rounded transition-colors duration-150 ${currentPage === index ? "bg-blue-900 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`} onClick={() => setCurrentPage(index)}>
                  {index + 1}
                </button>
              ))}
              <button disabled={currentPage === totalPages - 1} onClick={() => setCurrentPage((prev) => prev + 1)} className={`px-3 py-1 rounded transition-colors duration-150 ${currentPage === totalPages - 1 ? "bg-gray-300 text-gray-500" : "bg-blue-900 text-white hover:bg-blue-600"}`}>
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      <button onClick={scrollToTop} className="fixed bottom-4 right-4 bg-blue-900 text-white p-3 rounded-full shadow-md hover:bg-blue-600 transition-all duration-200 hover:scale-110">
        ↑
      </button>
    </div>
  );
};

export default Home;
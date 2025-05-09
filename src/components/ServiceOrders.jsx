import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

// Define the static service orders data
const staticServiceOrders = [
  {
    id: 1,
    orderId: "ORD001",
    customer: "Customer 1",
    orderAmount: 200,
    orderStatus: "Completed",
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    orderDate: "2023-10-01",
    isActive: true,
  },
  {
    id: 2,
    orderId: "ORD002",
    customer: "Customer 2",
    orderAmount: 1200,
    orderStatus: "Pending",
    paymentMethod: "PayPal",
    paymentStatus: "Unpaid",
    orderDate: "2023-10-02",
    isActive: true,
  },
  {
    id: 3,
    orderId: "ORD003",
    customer: "Customer 3",
    orderAmount: 750,
    orderStatus: "Completed",
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    orderDate: "2023-10-03",
    isActive: true,
  },
  {
    id: 4,
    orderId: "ORD004",
    customer: "Customer 4",
    orderAmount: 1500,
    orderStatus: "Pending",
    paymentMethod: "Bank Transfer",
    paymentStatus: "Unpaid",
    orderDate: "2023-10-04",
    isActive: true,
  },
  {
    id: 5,
    orderId: "ORD005",
    customer: "Customer 5",
    orderAmount: 1500,
    orderStatus: "Completed",
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    orderDate: "2023-10-05",
    isActive: true,
  },
  {
    id: 6,
    orderId: "ORD006",
    customer: "Customer 6",
    orderAmount: 200,
    orderStatus: "Completed",
    paymentMethod: "PayPal",
    paymentStatus: "Paid",
    orderDate: "2023-10-06",
    isActive: true,
  },
  {
    id: 7,
    orderId: "ORD007",
    customer: "Customer 7",
    orderAmount: 700,
    orderStatus: "Completed",
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    orderDate: "2023-10-07",
    isActive: true,
  },
  {
    id: 8,
    orderId: "ORD008",
    customer: "Customer 8",
    orderAmount: 800,
    orderStatus: "Pending",
    paymentMethod: "Bank Transfer",
    paymentStatus: "Unpaid",
    orderDate: "2023-10-08",
    isActive: true,
  },
  {
    id: 9,
    orderId: "ORD009",
    customer: "Customer 9",
    orderAmount: 250,
    orderStatus: "Completed",
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    orderDate: "2023-10-09",
    isActive: true,
  },
  {
    id: 10,
    orderId: "ORD010",
    customer: "Customer 10",
    orderAmount: 4000,
    orderStatus: "Completed",
    paymentMethod: "PayPal",
    paymentStatus: "Paid",
    orderDate: "2023-10-10",
    isActive: true,
  },
];

const ServiceOrders = () => {
  const [orders, setOrders] = useState(staticServiceOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    orderId: "",
    customer: "",
    orderAmount: "",
    orderStatus: "",
    paymentMethod: "",
    paymentStatus: "",
    orderDate: "",
    isActive: true,
  });
  const [itemsPerPage] = useState(10);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddOrder = (e) => {
    e.preventDefault();
    const newOrder = {
      id: orders.length + 1,
      ...formData,
    };
    setOrders([...orders, newOrder]);
    resetForm();
  };

  const handleUpdateOrder = (e) => {
    e.preventDefault();
    setOrders(
      orders.map((order) =>
        order.id === editingId ? { ...formData, id: editingId } : order
      )
    );
    resetForm();
  };

  const handleEditOrder = (order) => {
    setEditingId(order.id);
    setFormData({
      orderId: order.orderId,
      customer: order.customer,
      orderAmount: order.orderAmount,
      orderStatus: order.orderStatus,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderDate: order.orderDate,
      isActive: order.isActive,
    });
    setFormVisible(true);
  };

  const handleDeleteOrder = (id) => {
    setOrders(orders.filter((order) => order.id !== id));
    setConfirmDeleteId(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      orderId: "",
      customer: "",
      orderAmount: "",
      orderStatus: "",
      paymentMethod: "",
      paymentStatus: "",
      orderDate: "",
      isActive: true,
    });
    setFormVisible(false);
  };

  const filteredData = orders.filter((item) => {
    if (!item.customer) {
      return false;
    }
    return item.customer.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const startingSerialNumber = indexOfFirstItem + 1;

  const toggleStatus = (id, currentStatus) => {
    const newStatus = !currentStatus;
    setOrders((prevData) =>
      prevData.map((row) =>
        row.id === id ? { ...row, isActive: newStatus } : row
      )
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mt-4 mb-4">
        {/* Title or other elements can be added here */}
      </div>

      {formVisible ? (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4 md:text-xl">
            {editingId ? "Edit Service Order" : "Add New Service Order"}
          </h2>
          <form onSubmit={editingId ? handleUpdateOrder : handleAddOrder}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="col-span-1">
                <label className="block mb-2 font-medium">Order ID *</label>
                <input
                  type="text"
                  name="orderId"
                  value={formData.orderId}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="col-span-1">
                <label className="block mb-2 font-medium">Customer *</label>
                <input
                  type="text"
                  name="customer"
                  value={formData.customer}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="col-span-1">
                <label className="block mb-2 font-medium">Order Amount *</label>
                <input
                  type="number"
                  name="orderAmount"
                  value={formData.orderAmount}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="col-span-1">
                <label className="block mb-2 font-medium">Order Status *</label>
                <select
                  name="orderStatus"
                  value={formData.orderStatus}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                >
                  <option value="">Select Order Status</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="block mb-2 font-medium">Payment Method *</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                >
                  <option value="">Select Payment Method</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="block mb-2 font-medium">Payment Status *</label>
                <select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                >
                  <option value="">Select Payment Status</option>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="block mb-2 font-medium">Order Date *</label>
                <input
                  type="date"
                  name="orderDate"
                  value={formData.orderDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="col-span-1">
                <label className="block mb-2 font-medium">Status *</label>
                <select
                  name="isActive"
                  className="w-full border border-gray-300 p-2 rounded"
                  value={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.value === "true" })
                  }
                  required
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="px-4 py-2 mr-2 text-white bg-indigo-900 rounded hover:bg-indigo-600"
              >
                {editingId ? "Save" : "Add"}
              </button>
              <button
                type="button"
                className="ml-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-indigo-900">All Service Orders</h3>
            {!formVisible && (
              <button
                onClick={() => setFormVisible(true)}
                className="px-4 py-2 bg-indigo-900 text-white rounded hover:bg-indigo-600"
              >
                + Add Service Order
              </button>
            )}
            <input
              type="text"
              placeholder="Search By Customer..."
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative overflow-x-auto shadow-md rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-indigo-900 text-white">
                <tr>
                  <th scope="col" className="px-6 py-3">No.</th>
                  <th scope="col" className="px-6 py-3">Order ID</th>
                  <th scope="col" className="px-6 py-3">Customer</th>
                  <th scope="col" className="px-6 py-3">Order Amount</th>
                  <th scope="col" className="px-6 py-3">Order Status</th>
                  <th scope="col" className="px-6 py-3">Payment Method</th>
                  <th scope="col" className="px-6 py-3">Payment Status</th>
                  <th scope="col" className="px-6 py-3">Order Date</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-4">
                      No data found
                    </td>
                  </tr>
                ) : (
                  currentData.map((order, index) => (
                    <tr
                      key={order.id}
                      className={`border-b hover:bg-indigo-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="px-6 py-4 font-medium">{startingSerialNumber + index}</td>
                      <td className="px-6 py-4">{order.orderId}</td>
                      <td className="px-6 py-4">{order.customer}</td>
                      <td className="px-6 py-4">{order.orderAmount}</td>
                      <td className="px-6 py-4">{order.orderStatus}</td>
                      <td className="px-6 py-4">{order.paymentMethod}</td>
                      <td className="px-6 py-4">{order.paymentStatus}</td>
                      <td className="px-6 py-4">{order.orderDate}</td>
                      <td className="px-6 py-4">
                        <button
                          className={`px-2 py-1 rounded ${
                            order.isActive ? "bg-green-600 hover:bg-green-600 text-white" : "bg-red-700 hover:bg-red-600 text-white"
                          }`}
                          onClick={() => toggleStatus(order.id, order.isActive)}
                        >
                          {order.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            className="px-3 py-1.5 flex items-center text-white bg-indigo-800 hover:bg-indigo-600 rounded"
                            onClick={() => handleEditOrder(order)}
                          >
                            <FaEdit className="mr-1.5" size={14} />
                            Edit
                          </button>
                          {/* <button
                            className="px-3 py-1.5 flex items-center text-white bg-red-600 hover:bg-red-500 rounded"
                            onClick={() => setConfirmDeleteId(order.id)}
                          >
                            <FaTrash className="mr-1.5" size={14} />
                            Delete
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {confirmDeleteId && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded shadow-lg">
                <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
                <p className="mb-4">
                  Are you sure you want to delete this service order?
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-700"
                    onClick={() => handleDeleteOrder(confirmDeleteId)}
                  >
                    Yes, Delete
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded shadow-md hover:bg-gray-700"
                    onClick={() => setConfirmDeleteId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-600">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
            </p>
            <div className="flex space-x-1">
              <button
                className="px-3 py-1.5 text-sm text-white bg-indigo-800 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </button>
              {totalPages <= 5 ? (
                [...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    className={`px-3 py-1.5 rounded-md text-sm ${
                      currentPage === index + 1
                        ? "bg-indigo-800 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } transition-colors`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))
              ) : (
                <>
                  {[...Array(Math.min(3, currentPage))].map((_, index) => (
                    <button
                      key={index}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        currentPage === index + 1
                          ? "bg-indigo-800 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      } transition-colors`}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  {currentPage > 3 && <span className="px-2 py-1.5">...</span>}
                  {currentPage > 3 && currentPage < totalPages - 2 && (
                    <button
                      className="px-3 py-1.5 rounded-md text-sm bg-indigo-800 text-white"
                    >
                      {currentPage}
                    </button>
                  )}
                  {currentPage < totalPages - 2 && <span className="px-2 py-1.5">...</span>}
                  {[...Array(Math.min(3, totalPages - Math.max(0, totalPages - 3)))].map((_, index) => (
                    <button
                      key={totalPages - 2 + index}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        currentPage === totalPages - 2 + index
                          ? "bg-indigo-800 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      } transition-colors`}
                      onClick={() => setCurrentPage(totalPages - 2 + index)}
                    >
                      {totalPages - 2 + index}
                    </button>
                  ))}
                </>
              )}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-3 py-1.5 text-sm rounded-md bg-indigo-800 text-white hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
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

export default ServiceOrders;

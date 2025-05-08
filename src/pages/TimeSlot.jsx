import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const TimeSlot = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    startTime: "",
    endTime: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Simulate fetching data
    const staticData = [
      { id: 1, name: "06:00 AM - 07:00 AM", startTime: "06:00 AM", endTime: "07:00 AM", isActive: true },
      { id: 2, name: "07:00 AM - 08:00 AM", startTime: "07:00 AM", endTime: "08:00 AM", isActive: true },
      { id: 3, name: "08:00 AM - 09:00 AM", startTime: "08:00 AM", endTime: "09:00 AM", isActive: true },
      { id: 4, name: "09:00 AM - 10:00 AM", startTime: "09:00 AM", endTime: "10:00 AM", isActive: true },
      { id: 5, name: "10:00 AM - 11:00 AM", startTime: "10:00 AM", endTime: "11:00 AM", isActive: true },
      { id: 6, name: "11:00 AM - 12:00 PM", startTime: "11:00 AM", endTime: "12:00 PM", isActive: true },
      { id: 7, name: "12:00 PM - 01:00 PM", startTime: "12:00 PM", endTime: "01:00 PM", isActive: true },
      { id: 8, name: "01:00 PM - 02:00 PM", startTime: "01:00 PM", endTime: "02:00 PM", isActive: true },
      { id: 9, name: "02:00 PM - 03:00 PM", startTime: "02:00 PM", endTime: "03:00 PM", isActive: true },
      { id: 10, name: "03:00 PM - 04:00 PM", startTime: "03:00 PM", endTime: "04:00 PM", isActive: true },
    ];

    setLoading(true);
    setTimeout(() => {
      setData(staticData);
      setLoading(false);
    }, 1000);
  }, [currentPage]);

  const handleAddTimeSlot = (e) => {
    e.preventDefault();
    const newTimeSlot = {
      id: data.length + 1,
      ...formData,
    };
    setData([...data, newTimeSlot]);
    resetForm();
  };

  const handleSaveEditTimeSlot = (e) => {
    e.preventDefault();
    setData(
      data.map((timeSlot) => (timeSlot.id === editingId ? { ...formData, id: editingId } : timeSlot))
    );
    resetForm();
  };

  const handleEditTimeSlot = (timeSlot) => {
    setEditingId(timeSlot.id);
    setFormData({
      name: timeSlot.name,
      startTime: timeSlot.startTime,
      endTime: timeSlot.endTime,
      isActive: timeSlot.isActive,
    });
    setFormVisible(true);
  };

  const handleDeleteTimeSlot = (id) => {
    setData(data.filter((timeSlot) => timeSlot.id !== id));
    setConfirmDeleteId(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      startTime: "",
      endTime: "",
      isActive: true,
    });
    setFormVisible(false);
  };

  const filteredData = data.filter((item) => {
    if (!item.name) {
      return false;
    }
    return item.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const startingSerialNumber = indexOfFirstItem + 1;

  const toggleStatus = (id, currentStatus) => {
    const newStatus = !currentStatus;
    setData((prevData) =>
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
            {editingId ? "Edit Time Slot" : "Add New Time Slot"}
          </h2>
          <form onSubmit={editingId ? handleSaveEditTimeSlot : handleAddTimeSlot}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="col-span-1">
                <label className="block mb-2 font-medium">Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter time slot name"
                  className="border p-2 rounded w-full"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-span-1">
                <label className="block mb-2 font-medium">Start Time *</label>
                <input
                  type="time"
                  name="startTime"
                  className="w-full border border-gray-300 p-2 rounded"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-span-1">
                <label className="block mb-2 font-medium">End Time *</label>
                <input
                  type="time"
                  name="endTime"
                  className="w-full border border-gray-300 p-2 rounded"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
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
            <h3 className="text-xl font-bold text-indigo-900">All Time Slots</h3>
            {!formVisible && (
              <button
                onClick={() => setFormVisible(true)}
                className="px-4 py-2 bg-indigo-900 text-white rounded hover:bg-indigo-600"
              >
                + Add Time Slot
              </button>
            )}
            <input
              type="text"
              placeholder="Search By Time Slot Name..."
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
                  <th scope="col" className="px-6 py-3">Name</th>
                  <th scope="col" className="px-6 py-3">Start Time</th>
                  <th scope="col" className="px-6 py-3">End Time</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-900"></div>
                        <span className="ml-2">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : currentData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No data found
                    </td>
                  </tr>
                ) : (
                  currentData.map((timeSlot, index) => (
                    <tr
                      key={timeSlot.id}
                      className={`border-b hover:bg-indigo-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="px-6 py-4 font-medium">{startingSerialNumber + index}</td>
                      <td className="px-6 py-4">{timeSlot.name}</td>
                      <td className="px-6 py-4">{timeSlot.startTime}</td>
                      <td className="px-6 py-4">{timeSlot.endTime}</td>
                      <td className="px-6 py-4">
                        <button
                          className={`px-2 py-1 rounded ${
                            timeSlot.isActive ? "bg-green-600 hover:bg-green-600 text-white" : "bg-red-700 hover:bg-red-600 text-white"
                          }`}
                          onClick={() => toggleStatus(timeSlot.id, timeSlot.isActive)}
                        >
                          {timeSlot.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            className="px-3 py-1.5 flex items-center text-white bg-indigo-800 hover:bg-indigo-600 rounded"
                            onClick={() => handleEditTimeSlot(timeSlot)}
                          >
                            <FaEdit className="mr-1.5" size={14} />
                            Edit
                          </button>
                          {/* <button
                            className="px-3 py-1.5 flex items-center text-white bg-red-600 hover:bg-red-500 rounded"
                            onClick={() => setConfirmDeleteId(timeSlot.id)}
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
                  Are you sure you want to delete this time slot?
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-700"
                    onClick={() => handleDeleteTimeSlot(confirmDeleteId)}
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

export default TimeSlot;

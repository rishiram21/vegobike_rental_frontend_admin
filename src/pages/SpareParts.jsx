import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

// Define the static spare parts data
const staticSpareParts = [
  {
    id: 1,
    partImage: "path_to_image_1",
    partName: "Service 1",
    spareType: "Common",
    price: 200,
    isActive: true,
  },
  {
    id: 2,
    partImage: "path_to_image_2",
    partName: "Battery",
    spareType: "Common",
    price: 1200,
    isActive: true,
  },
  {
    id: 3,
    partImage: "path_to_image_3",
    partName: "Marine Engine oil",
    spareType: "Common",
    price: 750,
    isActive: true,
  },
  {
    id: 4,
    partImage: "path_to_image_4",
    partName: "Brake Pads",
    spareType: "Common",
    price: 1500,
    isActive: true,
  },
  {
    id: 5,
    partImage: "path_to_image_5",
    partName: "Air Filter",
    spareType: "Common",
    price: 1500,
    isActive: true,
  },
  {
    id: 8,
    partImage: "path_to_image_6",
    partName: "Air Filter",
    spareType: "Common",
    price: 200,
    isActive: true,
  },
  {
    id: 9,
    partImage: "path_to_image_7",
    partName: "Clutch cable",
    spareType: "Common",
    price: 700,
    isActive: true,
  },
  {
    id: 10,
    partImage: "path_to_image_8",
    partName: "Meter assembly",
    spareType: "Common",
    price: 800,
    isActive: true,
  },
  {
    id: 11,
    partImage: "path_to_image_9",
    partName: "Clutch lever",
    spareType: "Common",
    price: 250,
    isActive: true,
  },
  {
    id: 12,
    partImage: "path_to_image_10",
    partName: "Test",
    spareType: "Specific",
    price: 4000,
    isActive: true,
  },
];

const SpareParts = () => {
  const [spareParts, setSpareParts] = useState(staticSpareParts);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    partImage: "",
    partName: "",
    spareType: "",
    price: "",
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

  const handleAddSparePart = (e) => {
    e.preventDefault();
    const newSparePart = {
      id: spareParts.length + 1,
      ...formData,
    };
    setSpareParts([...spareParts, newSparePart]);
    resetForm();
  };

  const handleUpdateSparePart = (e) => {
    e.preventDefault();
    setSpareParts(
      spareParts.map((sparePart) =>
        sparePart.id === editingId ? { ...formData, id: editingId } : sparePart
      )
    );
    resetForm();
  };

  const handleEditSparePart = (sparePart) => {
    setEditingId(sparePart.id);
    setFormData({
      partImage: sparePart.partImage,
      partName: sparePart.partName,
      spareType: sparePart.spareType,
      price: sparePart.price,
      isActive: sparePart.isActive,
    });
    setFormVisible(true);
  };

  const handleDeleteSparePart = (id) => {
    setSpareParts(spareParts.filter((sparePart) => sparePart.id !== id));
    setConfirmDeleteId(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      partImage: "",
      partName: "",
      spareType: "",
      price: "",
      isActive: true,
    });
    setFormVisible(false);
  };

  const filteredData = spareParts.filter((item) => {
    if (!item.partName) {
      return false;
    }
    return item.partName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const startingSerialNumber = indexOfFirstItem + 1;

  const toggleStatus = (id, currentStatus) => {
    const newStatus = !currentStatus;
    setSpareParts((prevData) =>
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
            {editingId ? "Edit Spare Part" : "Add New Spare Part"}
          </h2>
          <form onSubmit={editingId ? handleUpdateSparePart : handleAddSparePart}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="col-span-1">
                <label className="block mb-2 font-medium">Part Image</label>
                <input
                  type="file"
                  name="partImage"
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="col-span-1">
                <label className="block mb-2 font-medium">Part Name *</label>
                <input
                  type="text"
                  name="partName"
                  value={formData.partName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="col-span-1">
                <label className="block mb-2 font-medium">Spare Type *</label>
                <select
                  name="spareType"
                  value={formData.spareType}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                >
                  <option value="">Select Spare Type</option>
                  <option value="Common">Common</option>
                  <option value="Specific">Specific</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="block mb-2 font-medium">Price *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
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
            <h3 className="text-xl font-bold text-indigo-900">All Spare Parts</h3>
            {!formVisible && (
              <button
                onClick={() => setFormVisible(true)}
                className="px-4 py-2 bg-indigo-900 text-white rounded hover:bg-indigo-600"
              >
                + Add Spare Part
              </button>
            )}
            <input
              type="text"
              placeholder="Search By Part Name..."
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
                  <th scope="col" className="px-6 py-3">Part Image</th>
                  <th scope="col" className="px-6 py-3">Part Name</th>
                  <th scope="col" className="px-6 py-3">Spare Type</th>
                  <th scope="col" className="px-6 py-3">Price</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No data found
                    </td>
                  </tr>
                ) : (
                  currentData.map((sparePart, index) => (
                    <tr
                      key={sparePart.id}
                      className={`border-b hover:bg-indigo-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="px-6 py-4 font-medium">{startingSerialNumber + index}</td>
                      <td className="px-6 py-4">
                        <img
                          src={sparePart.partImage}
                          alt={sparePart.partName}
                          className="w-12 h-12 object-cover"
                        />
                      </td>
                      <td className="px-6 py-4">{sparePart.partName}</td>
                      <td className="px-6 py-4">{sparePart.spareType}</td>
                      <td className="px-6 py-4">{sparePart.price}</td>
                      <td className="px-6 py-4">
                        <button
                          className={`px-2 py-1 rounded ${
                            sparePart.isActive ? "bg-green-600 hover:bg-green-600 text-white" : "bg-red-700 hover:bg-red-600 text-white"
                          }`}
                          onClick={() => toggleStatus(sparePart.id, sparePart.isActive)}
                        >
                          {sparePart.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            className="px-3 py-1.5 flex items-center text-white bg-indigo-800 hover:bg-indigo-600 rounded"
                            onClick={() => handleEditSparePart(sparePart)}
                          >
                            <FaEdit className="mr-1.5" size={14} />
                            Edit
                          </button>
                          {/* <button
                            className="px-3 py-1.5 flex items-center text-white bg-red-600 hover:bg-red-500 rounded"
                            onClick={() => setConfirmDeleteId(sparePart.id)}
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
                  Are you sure you want to delete this spare part?
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-700"
                    onClick={() => handleDeleteSparePart(confirmDeleteId)}
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

export default SpareParts;

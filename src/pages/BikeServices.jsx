import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

// Define the static bike services data
const staticBikeServices = [
  {
    id: 1,
    serviceImage: "path_to_image_1",
    serviceName: "Test Service",
    category: "Bike v1",
    brandName: "HONDA",
    modelName: "Shine 125",
    year: 2021,
    price: 399.00,
    isActive: true,
  },
  {
    id: 2,
    serviceImage: "path_to_image_2",
    serviceName: "Oil Change",
    category: "Bike v1",
    brandName: "HONDA",
    modelName: "Shine 125",
    year: 2013,
    price: 500.00,
    isActive: true,
  },
  {
    id: 3,
    serviceImage: "path_to_image_3",
    serviceName: "Air Filter",
    category: "Bike v1",
    brandName: "HONDA",
    modelName: "Shine 125",
    year: 2022,
    price: 1000.00,
    isActive: true,
  },
  {
    id: 4,
    serviceImage: "path_to_image_4",
    serviceName: "Chain Lubrication and Adjustment",
    category: "Bike v1",
    brandName: "HERO",
    modelName: "Hero Xtreme 125R",
    year: 2019,
    price: 450.00,
    isActive: true,
  },
  {
    id: 5,
    serviceImage: "path_to_image_5",
    serviceName: "Test Service",
    category: "Bike v1",
    brandName: "HONDA",
    modelName: "Unicorn",
    year: 2011,
    price: 299.00,
    isActive: true,
  },
  {
    id: 6,
    serviceImage: "path_to_image_6",
    serviceName: "Tolling",
    category: "Bike v1",
    brandName: "HONDA",
    modelName: "Shine 125",
    year: 2015,
    price: 1000.00,
    isActive: true,
  },
  {
    id: 7,
    serviceImage: "path_to_image_7",
    serviceName: "Air Filter",
    category: "Scooter",
    brandName: "TVS",
    modelName: "Jupiter",
    year: 2015,
    price: 800.00,
    isActive: true,
  },
  {
    id: 8,
    serviceImage: "path_to_image_8",
    serviceName: "Servicing",
    category: "Scooter",
    brandName: "TVS",
    modelName: "Jupiter",
    year: 2020,
    price: 800.00,
    isActive: true,
  },
  {
    id: 9,
    serviceImage: "path_to_image_9",
    serviceName: "Test Service",
    category: "Sports Bike",
    brandName: "HERO",
    modelName: "Splendor",
    year: 2012,
    price: 1200.00,
    isActive: true,
  },
];

const BikeServices = () => {
  const [services, setServices] = useState(staticBikeServices);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    serviceImage: "",
    serviceName: "",
    category: "",
    brandName: "",
    modelName: "",
    year: "",
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

  const handleAddService = (e) => {
    e.preventDefault();
    const newService = {
      id: services.length + 1,
      ...formData,
    };
    setServices([...services, newService]);
    resetForm();
  };

  const handleUpdateService = (e) => {
    e.preventDefault();
    setServices(
      services.map((service) =>
        service.id === editingId ? { ...formData, id: editingId } : service
      )
    );
    resetForm();
  };

  const handleEditService = (service) => {
    setEditingId(service.id);
    setFormData({
      serviceImage: service.serviceImage,
      serviceName: service.serviceName,
      category: service.category,
      brandName: service.brandName,
      modelName: service.modelName,
      year: service.year,
      price: service.price,
      isActive: service.isActive,
    });
    setFormVisible(true);
  };

  const handleDeleteService = (id) => {
    setServices(services.filter((service) => service.id !== id));
    setConfirmDeleteId(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      serviceImage: "",
      serviceName: "",
      category: "",
      brandName: "",
      modelName: "",
      year: "",
      price: "",
      isActive: true,
    });
    setFormVisible(false);
  };

  const filteredData = services.filter((item) => {
    if (!item.serviceName) {
      return false;
    }
    return item.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const startingSerialNumber = indexOfFirstItem + 1;

  const toggleStatus = (id, currentStatus) => {
    const newStatus = !currentStatus;
    setServices((prevData) =>
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
            {editingId ? "Edit Bike Service" : "Add New Bike Service"}
          </h2>
          <form onSubmit={editingId ? handleUpdateService : handleAddService}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="col-span-1">
                <label className="block mb-2 font-medium">Service Image</label>
                <input
                  type="file"
                  name="serviceImage"
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="col-span-1">
                <label className="block mb-2 font-medium">Service Name *</label>
                <input
                  type="text"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="col-span-1">
                <label className="block mb-2 font-medium">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Bike v1">Bike v1</option>
                  <option value="Scooter">Scooter</option>
                  <option value="Sports Bike">Sports Bike</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="block mb-2 font-medium">Brand Name *</label>
                <select
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                >
                  <option value="">Select Brand</option>
                  <option value="HONDA">HONDA</option>
                  <option value="HERO">HERO</option>
                  <option value="TVS">TVS</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="block mb-2 font-medium">Model Name *</label>
                <select
                  name="modelName"
                  value={formData.modelName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                >
                  <option value="">Select Model</option>
                  <option value="Shine 125">Shine 125</option>
                  <option value="Unicorn">Unicorn</option>
                  <option value="Hero Xtreme 125R">Hero Xtreme 125R</option>
                  <option value="Jupiter">Jupiter</option>
                  <option value="Splendor">Splendor</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="block mb-2 font-medium">Year *</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                >
                  <option value="">Select Year</option>
                  <option value="2011">2011</option>
                  <option value="2012">2012</option>
                  <option value="2013">2013</option>
                  <option value="2015">2015</option>
                  <option value="2019">2019</option>
                  <option value="2020">2020</option>
                  <option value="2021">2021</option>
                  <option value="2022">2022</option>
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
            <h3 className="text-xl font-bold text-indigo-900">All Bike Services</h3>
            {!formVisible && (
              <button
                onClick={() => setFormVisible(true)}
                className="px-4 py-2 bg-indigo-900 text-white rounded hover:bg-indigo-600"
              >
                + Add Bike Service
              </button>
            )}
            <input
              type="text"
              placeholder="Search By Service Name..."
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
                  <th scope="col" className="px-6 py-3">Service Image</th>
                  <th scope="col" className="px-6 py-3">Service Name</th>
                  <th scope="col" className="px-6 py-3">Category</th>
                  <th scope="col" className="px-6 py-3">Brand Name</th>
                  <th scope="col" className="px-6 py-3">Model Name</th>
                  <th scope="col" className="px-6 py-3">Year</th>
                  <th scope="col" className="px-6 py-3">Price</th>
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
                  currentData.map((service, index) => (
                    <tr
                      key={service.id}
                      className={`border-b hover:bg-indigo-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="px-6 py-4 font-medium">{startingSerialNumber + index}</td>
                      <td className="px-6 py-4">
                        <img
                          src={service.serviceImage}
                          alt={service.serviceName}
                          className="w-12 h-12 object-cover"
                        />
                      </td>
                      <td className="px-6 py-4">{service.serviceName}</td>
                      <td className="px-6 py-4">{service.category}</td>
                      <td className="px-6 py-4">{service.brandName}</td>
                      <td className="px-6 py-4">{service.modelName}</td>
                      <td className="px-6 py-4">{service.year}</td>
                      <td className="px-6 py-4">{service.price}</td>
                      <td className="px-6 py-4">
                        <button
                          className={`px-2 py-1 rounded ${
                            service.isActive ? "bg-green-600 hover:bg-green-600 text-white" : "bg-red-700 hover:bg-red-600 text-white"
                          }`}
                          onClick={() => toggleStatus(service.id, service.isActive)}
                        >
                          {service.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            className="px-3 py-1.5 flex items-center text-white bg-indigo-800 hover:bg-indigo-600 rounded"
                            onClick={() => handleEditService(service)}
                          >
                            <FaEdit className="mr-1.5" size={14} />
                            Edit
                          </button>
                          {/* <button
                            className="px-3 py-1.5 flex items-center text-white bg-red-600 hover:bg-red-500 rounded"
                            onClick={() => setConfirmDeleteId(service.id)}
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
                  Are you sure you want to delete this bike service?
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-700"
                    onClick={() => handleDeleteService(confirmDeleteId)}
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

export default BikeServices;

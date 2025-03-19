import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { BASE_URL } from "../api/api";
import apiClient from "../api/apiConfig";

function convertImageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

const Bikes = () => {
  const [data, setData] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [models, setModels] = useState([]);
  const [stores, setStores] = useState([]);
  const [fuel, setFuel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    vehicleBrandId: "",
    vehicleCategoryId: "",
    vehicleModelId: "",
    storeId: "",
    vehicleRegistrationNumber: "",
    registrationYear: "",
    chassisNumber: "",
    engineNumber: "",
    fuelType: "",
    vehicleStatus: "",
    pucPdfFile: null,
    insurancePdfFile: null,
    documentPdfFile: null,
    image: null,
  });

  const fetchBikes = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/vehicle/all", {
        params: {
          page: currentPage - 1,
          size: itemsPerPage,
        },
      });
      setData(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching bike data:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.vehicleBrandId) newErrors.vehicleBrandId = "Brand Name is required";
    if (!formData.vehicleModelId) newErrors.vehicleModelId = "Model Name is required";
    if (!formData.vehicleCategoryId) newErrors.vehicleCategoryId = "Category Name is required";
    if (!formData.vehicleRegistrationNumber) newErrors.vehicleRegistrationNumber = "Vehicle Registration Number is required";
    if (!formData.registrationYear) newErrors.registrationYear = "Registration Year is required";
    if (!formData.storeId) newErrors.storeId = "Store Name is required";
    if (!formData.pucPdfFile) newErrors.pucPdfFile = "PUC PDF is required";
    if (!formData.insurancePdfFile) newErrors.insurancePdfFile = "Insurance PDF is required";
    if (!formData.documentPdfFile) newErrors.documentPdfFile = "Document PDF is required";
    if (!formData.image) newErrors.image = "Vehicle Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddBike = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    apiClient
      .post("/vehicle/add", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setData([...data, response.data]);
        resetForm();

        window.location.reload();
      })
      .catch((error) => {
        console.error("Error Adding Bike Data", error);
      });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const maxFileSize = 3 * 1024 * 1024; // 3 MB in bytes

    if (file) {
      if (file.size > maxFileSize) {
        alert("File size should not exceed 3 MB");
        return;
      }
      setFormData({
        ...formData,
        [e.target.name]: file,
      });
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await apiClient.get("/brand/all");
      setBrands(response.data.content);
    } catch (error) {
      console.error("Error fetching brand data:", error);
    }
  };

  const fetchModels = async (id) => {
    if (id) {
      try {
        const response = await apiClient.get(`/model/bybrandid/${id}`);
        setModels(response.data);
      } catch (error) {
        console.error("Error fetching model data:", error);
      }
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await apiClient.get("/category/all");
      setCategories(response.data.content);
    } catch (error) {
      console.error("Error fetching category data:", error);
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

  const fetchFuel = async () => {
    try {
      const response = await apiClient.get("/fuel/all");
      setFuel(response.data.content);
    } catch (error) {
      console.error("Error fetching fuel data:", error);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await apiClient.put(`/vehicle/${editingId}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setData((prevData) =>
        prevData.map((bike) => (bike.id === editingId ? response.data : bike))
      );
      resetForm();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleEditBike = (bike) => {
    setEditingId(bike.id);
    setFormData({
      vehicleBrandId: bike.vehicleBrandId,
      vehicleCategoryId: bike.vehicleCategoryId,
      vehicleModelId: bike.vehicleModelId,
      storeId: bike.storeId,
      vehicleRegistrationNumber: bike.vehicleRegistrationNumber,
      registrationYear: bike.registrationYear,
      chassisNumber: bike.chassisNumber,
      engineNumber: bike.engineNumber,
      fuelType: bike.fuelType,
      vehicleStatus: bike.vehicleStatus,
      pucPdfFile: bike.pucPdfFile,
      insurancePdfFile: bike.insurancePdfFile,
      documentPdfFile: bike.documentPdfFile,
      image: bike.image,
    });
    setFormVisible(true);
  };

  const handleDeleteBike = (id) => {
    apiClient
      .delete(`/vehicle/${id}`)
      .then(() => setData(data.filter((bike) => bike.id !== id)))
      .catch((error) => console.error("Error deleting data:", error))
      .finally(() => setConfirmDeleteId(null));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      vehicleBrandId: "",
      vehicleCategoryId: "",
      vehicleModelId: "",
      storeId: "",
      vehicleRegistrationNumber: "",
      registrationYear: "",
      chassisNumber: "",
      engineNumber: "",
      fuelType: "",
      vehicleStatus: "",
      pucPdfFile: null,
      insurancePdfFile: null,
      documentPdfFile: null,
      image: null,
    });
    setFormVisible(false);
    setErrors({});
  };

  const filteredData = data.filter(
    (item) =>
      item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const toggleStatus = (id) => {
    setStatuses((prevStatuses) =>
      prevStatuses.map((row) =>
        row.id === id
          ? {
              ...row,
              status: row.status === "AVILABLE" ? "BOOKED" : "AVILABLE",
            }
          : row
      )
    );
  };

  useEffect(() => {
    fetchBikes();
    fetchBrands();
    fetchModels();
    fetchCategory();
    fetchStores();
    fetchFuel();
  }, [currentPage]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen mt-14">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Bikes</h1>
        {!formVisible && (
          <button
            onClick={() => setFormVisible(true)}
            className="px-4 py-2 bg-blue-900 text-white rounded-r hover:bg-blue-600"
          >
            + Add Bike
          </button>
        )}
      </div>

      {formVisible ? (
        <div className="p-6 bg-white shadow-md rounded">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? "Edit Bike" : "Add New Bike"}
          </h2>
          <form onSubmit={editingId ? handleSaveEdit : handleAddBike}>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="font-medium">
                  Brand Name <span className="text-red-500">*</span>
                </label>
                <select
                  name="vehicleBrandId"
                  className="border p-2 rounded w-full"
                  value={formData.vehicleBrandId}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      vehicleBrandId: e.target.value,
                    });
                    fetchModels(e.target.value);
                  }}
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                {errors.vehicleBrandId && (
                  <span className="text-red-500 text-sm">{errors.vehicleBrandId}</span>
                )}
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="font-medium">
                  Model Name <span className="text-red-500">*</span>
                </label>
                <select
                  name="vehicleModelId"
                  className="border p-2 rounded w-full"
                  value={formData.vehicleModelId}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicleModelId: e.target.value })
                  }
                  disabled={!formData.vehicleBrandId}
                >
                  <option value="" disabled>
                    Select Model
                  </option>
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.modelName}
                    </option>
                  ))}
                </select>
                {errors.vehicleModelId && (
                  <span className="text-red-500 text-sm">{errors.vehicleModelId}</span>
                )}
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="font-medium">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <select
                  name="vehicleCategoryId"
                  className="border p-2 rounded w-full"
                  value={formData.vehicleCategoryId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vehicleCategoryId: e.target.value,
                    })
                  }
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.vehicleCategoryId && (
                  <span className="text-red-500 text-sm">{errors.vehicleCategoryId}</span>
                )}
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="font-medium">
                  Vehicle Registration Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="vehicleRegistrationNumber"
                  placeholder="Enter Vehicle Registration Number"
                  value={formData.vehicleRegistrationNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vehicleRegistrationNumber: e.target.value,
                    })
                  }
                  className="border p-2 rounded w-full"
                />
                {errors.vehicleRegistrationNumber && (
                  <span className="text-red-500 text-sm">{errors.vehicleRegistrationNumber}</span>
                )}
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="font-medium">
                  Registration Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="registrationYear"
                  placeholder="Enter Registration Year"
                  value={formData.registrationYear}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      registrationYear: e.target.value,
                    })
                  }
                  className="border p-2 rounded w-full"
                />
                {errors.registrationYear && (
                  <span className="text-red-500 text-sm">{errors.registrationYear}</span>
                )}
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="font-medium">Vehicle Chassis Number</label>
                <input
                  type="text"
                  name="chassisNumber"
                  placeholder="Enter Vehicle Chassis Number"
                  value={formData.chassisNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      chassisNumber: e.target.value,
                    })
                  }
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="font-medium">Vehicle Engine Number</label>
                <input
                  type="text"
                  name="engineNumber"
                  placeholder="Enter Vehicle Engine Number"
                  value={formData.engineNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      engineNumber: e.target.value,
                    })
                  }
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="font-medium">
                  Store Name <span className="text-red-500">*</span>
                </label>
                <select
                  name="storeId"
                  className="border p-2 rounded w-full"
                  value={formData.storeId}
                  onChange={(e) =>
                    setFormData({ ...formData, storeId: e.target.value })
                  }
                >
                  <option value="">Select Store</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
                {errors.storeId && (
                  <span className="text-red-500 text-sm">{errors.storeId}</span>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium">
                  Upload PUC <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="pucPdfFile"
                  className="w-full border border-gray-300 p-2 rounded"
                  onChange={handleFileUpload}
                />
                {errors.pucPdfFile && (
                  <span className="text-red-500 text-sm">{errors.pucPdfFile}</span>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium">
                  Upload Insurance <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="insurancePdfFile"
                  className="w-full border border-gray-300 p-2 rounded"
                  onChange={handleFileUpload}
                />
                {errors.insurancePdfFile && (
                  <span className="text-red-500 text-sm">{errors.insurancePdfFile}</span>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">
                  Upload Document (RC, Any) <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="documentPdfFile"
                  className="w-full border border-gray-300 p-2 rounded"
                  onChange={handleFileUpload}
                />
                {errors.documentPdfFile && (
                  <span className="text-red-500 text-sm">{errors.documentPdfFile}</span>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">
                  Upload Vehicle Images <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="image"
                  className="w-full border border-gray-300 p-2 rounded"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      try {
                        const base64String = await convertImageToBase64(file);
                        setFormData({
                          ...formData,
                          image: base64String,
                        });
                      } catch (error) {
                        console.error("Error converting image:", error);
                      }
                    }
                  }}
                />
                {errors.image && (
                  <span className="text-red-500 text-sm">{errors.image}</span>
                )}
              </div>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-600"
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
        <div className="bg-white p-6 shadow-md rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search by Brand Name"
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
                  <th scope="col" className="px-6 py-3">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Brand Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Model Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Vehicle Registration Number
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No data Found
                    </td>
                  </tr>
                ) : (
                  currentData.map((bike) => (
                    <tr
                      key={bike.id}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">{bike.id}</td>
                      <td className="px-6 py-4">{bike.brand}</td>
                      <td className="px-6 py-4">{bike.categoryName}</td>
                      <td className="px-6 py-4">{bike.model}</td>
                      <td className="px-6 py-4">
                        {bike.vehicleRegistrationNumber}
                      </td>
                      <td className="px-6 py-4 ">
                        <div className="flex items-center space-x-4">
                          <button
                            className="px-4 py-2 flex items-center text-white bg-blue-800 hover:bg-blue-600 rounded"
                            onClick={() => handleEditBike(bike)}
                          >
                            <FaEdit className="mr-2" />
                            Edit
                          </button>
                          {/* <button
                            className="px-4 py-2 flex items-center text-white bg-red-800 hover:bg-red-600 rounded"
                            onClick={() => setConfirmDeleteId(bike.id)}
                          >
                            <FaTrash />
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
                <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
                <p className="mb-4">
                  Are you sure you want to delete this Bike?
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-700"
                    onClick={() => handleDeleteBike(confirmDeleteId)}
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
      )}
    </div>
  );
};

export default Bikes;

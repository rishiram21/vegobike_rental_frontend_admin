import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";

function convertImageToBase64(file) {
  console.log(file);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
}

const Bikes = () => {
  const [data, setData] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formVisible, setFormVisible] = useState(false); //FORM State
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [brands, setBrands] = useState([]); //for the brands
  const [categories, setCategories] = useState([]); //for the categories
  const [models, setModels] = useState([]); //for the models
  const [stores, setStores] = useState([]); //for the stores
  const [fuel, setFuel] = useState([]); //for the fule

  const [page, setPage] = useState(0); // Current page number
  const [size, setSize] = useState(5); // Items per page
  const [sortBy, setSortBy] = useState("id"); // Default sorting field
  const [sortDirection, setSortDirection] = useState("ASC"); // Default sorting direction
  const [totalPages, setTotalPages] = useState(0); // Total pages from the backend

  // const [currentBike, setCurrentBike] = useState(null);
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
    pucPdfFile: "",
    insurancePdfFile: "",
    documentPdfFile: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);

  //function for bikes fetching
  const fetchBikes = async () => {
    setLoading(true);
    try {
      // const response = await axios.get("http://localhost:8080/vehicle/all");
      const response = await axios.get("http://localhost:8080/vehicle/all", {
        params: {
          page,
          size,
          sortBy,
          sortDirection,
        },
      });
      setData(response.data.content);
      setStatuses(
        response.data.content.map((item) => ({ id: item.id, status: "Active" }))
      );
      if (response.data.content && response.data.totalPages !== undefined) {
        setData(response.data.content); // 'content' contains the paginated items
        setTotalPages(response.data.totalPages); // Update total pages
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error Fetching Bike Data", error);
    } finally {
      setLoading(false);
    }
  };

  // Add Bike
  // const handleAddBike = (e) => {
  //   e.preventDefault();

  //   axios
  //     .post("http://localhost:8080/vehicle/add", formData)
  //     .then((response) => {
  //       // Ensure `data` is an array
  //       if (!Array.isArray(data)) {
  //         console.error("Data is not an array. Resetting to an empty array.");
  //         setData([response.data]);
  //       } else {
  //         setData([...data, response.data]);
  //       }
  //       resetForm();
  //     })
  //     .catch((error) => ("Error Addding Bike Data", error));
  // };

  const handleAddBike = (e) => {
    e.preventDefault();

    // Create a FormData object
    const _formData = new FormData();

    // Append the fields from your form to the FormData object
    // Assuming payload is an object with key-value pairs that need to be sent
    Object.keys(formData)?.forEach((key) => {
      _formData.append(key, formData[key]);
    });

    console.log({ formData, _formData });

    // Send the FormData object in the axios request
    axios
      .post("http://localhost:8080/vehicle/add", _formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensuring the content type is set to multipart/form-data
        },
      })
      .then((response) => {
        // Ensure `data` is an array
        if (!Array.isArray(data)) {
          console.error("Data is not an array. Resetting to an empty array.");
          setData([response.data]);
        } else {
          setData([...data, response.data]);
        }
        resetForm();
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
        [e?.target?.name]: file,
      });
    }
  };

  //function for brands bikes
  const fetchBrands = async () => {
    try {
      const response = await axios.get("http://localhost:8080/brand/all");
      setBrands(response.data.content);
    } catch (error) {
      console.error("Error fetching brand data:", error);
    }
  };

  //Funtion for the model
  const fetchModels = async (id) => {
    if (id) {
      try {
        const response = await axios.get(
          `http://localhost:8080/model/bybrandid/${id}`
        );
        setModels(response.data); //update models state
      } catch (error) {
        console.error("Error fetching model data:", error);
      }
    }
  };
  console.log(models);

  //category
  const fetchCategory = async () => {
    try {
      const response = await axios.get("http://localhost:8080/category/all");
      setCategories(response.data.content);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  //stores
  const fetchStores = async () => {
    try {
      const response = await axios.get("http://localhost:8080/store/all");
      setStores(response.data.content);
    } catch (error) {
      console.error("Error fetching stores data:", error);
    }
  };

  //fuel
  const fetchFuel = async () => {
    try {
      const response = await axios.get("");
      setFuel(response.data.content);
    } catch (error) {
      console.error("Error fetching stores data:", error);
    }
  };

  //Save Edit Bike
  const handleSaveEdit = (e) => {
    e.preventDefault();
    axios
      .get(`http://localhost:8080/vehicle/${Id}`, formData)
      .then((response) => {
        setData(
          data.map((bike) => (bike.id === editingId ? response.data : bike))
        );
        resetForm();
      })
      .catch((error) => console.error("Erro Saving Data:", error));
  };

  // Edit Bike
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

  //Delete Store
  const handleDeleteBike = (id) => {
    axios
      .delete(`http://localhost:8080/api/bikes/${id}`)
      .then(() => setData(data.filter((bike) => bike.id !== id)))
      .catch((error) => console.error("Error deleting data:", error))
      .finally(() => setConfirmDeleteId(null));
  };

  //Reset Form
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
      pucPdfFile: "",
      insurancePdfFile: "",
      documentPdfFile: "",
      image: "",
    });
    setFormVisible(false);
  };

  // Filtered data based on search query
  const filteredData = data.filter((item) => {
    console.log("Current item being checked:", item); // Log the current item
    if (item.brandName) {
      // //   console.log("Item skipped because category is null or undefined:", item);
      // //   return false; // Exclude items with a null or undefined category
      return item?.brandName.toLowerCase().includes(searchQuery.toLowerCase());
    }
  });

  // Pagination logic
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  // console.log(indexOfFirstItem, indexOfLastItem, currentData, filteredData);
  // const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  useEffect(() => {
    fetchData();
  }, [page, size, sortBy, sortDirection]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/vehicle/all", {
        params: {
          page,
          size,
          sortBy,
          sortDirection,
        },
      });
      if (response.data.content && response.data.totalPages !== undefined) {
        setData(response.data.content); // 'content' contains the paginated items
        setTotalPages(response.data.totalPages); // Update total pages
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  // Toggle status function
  const toggleStatus = (id) => {
    setStatuses((prevStatuses) =>
      prevStatuses.map((row) =>
        row.id === id
          ? { ...row, status: row.status === "Active" ? "Inactive" : "Active" }
          : row
      )
    );
  };

  //Fetch brand data
  useEffect(() => {
    fetchBikes();
    fetchBrands();
    fetchModels();
    fetchCategory();
    fetchStores();
    fetchFuel();
  }, []);

  useEffect(() => {
    console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHH", formData);
  }, [formData]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Bike List</h1>
        {!formVisible && (
          <button
            onClick={() => setFormVisible(true)}
            // onClick={handleAddBike}
            className="px-4 py-2 bg-blue-900 text-white rounded-r hover:bg-blue-600"
          >
            + Add Bike
          </button>
        )}
      </div>

      {/* Form  */}

      {formVisible ? (
        <div className="p-6 bg-white shadow-md rounded">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? "Edit Bike" : "Add New Bike"}
          </h2>
          <form onSubmit={editingId ? handleSaveEdit : handleAddBike}>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="font-medium">Brand Name *</label>
                <select
                  name="vehicleBrandId"
                  placeholder="Enter Brand Name"
                  className="border p-2 rounded w-full"
                  value={formData.vehicleBrandId}
                  onChange={(e) => {
                    console.log(formData, "data", e.target.value);
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
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="font-medium">Model Name *</label>
                <select
                  name="vehicleModelId"
                  placeholder="Enter Model Name"
                  className="border p-2 rounded w-full"
                  value={formData.vehicleModelId}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicleModelId: e.target.value })
                  }
                  disabled={!formData.vehicleBrandId} //Disable if no city is selected
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
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="font-medium">Category Name *</label>
                <select
                  name="vehicleCategoryId"
                  placeholder="Enter Brand Name"
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
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="font-medium">
                  Vehicle Registration Number *
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
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="font-medium">Registration Year *</label>
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
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="font-medium">Vehicle Chassis Number *</label>
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
                <label className="font-medium">Vehicle Engine Number *</label>
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
                <label className="font-medium">Store Name *</label>
                <select
                  name="storeId"
                  placeholder="Enter Store Name"
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
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium">Upload PUC</label>
                <input
                  type="file"
                  name="pucPdfFile"
                  className="w-full border border-gray-300 p-2 rounded"
                  onChange={handleFileUpload}
                />
                {formData.pucPdfFile && (
                  <div className="mt-2">
                    <div className="w-[90px] h-[90px] border border-gray-300 rounded flex items-center justify-center overflow-hidden">
                      <img
                        src={formData.pucPdfFile}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium">
                  Upload Insurance
                </label>
                <input
                  type="file"
                  name="insurancePdfFile"
                  className="w-full border border-gray-300 p-2 rounded"
                  onChange={handleFileUpload}
                  // onChange={async (e) => {
                  //   const file = e.target.files[0];
                  //   if (file) {
                  //     try {
                  //       const base64String = await convertImageToBase64(file);
                  //       console.log("Base64:", base64String);
                  //       setFormData({
                  //         ...formData,
                  //         insurancePdfFile: file,
                  //       });
                  //     } catch (error) {
                  //       console.error("Error converting image:", error);
                  //     }
                  //   }
                  // }}
                />
                {formData.insurancePdfFile && (
                  <div className="mt-2">
                    <div className="w-[90px] h-[90px] border border-gray-300 rounded flex items-center justify-center overflow-hidden">
                      <img
                        src={formData.insurancePdfFile}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">
                  Upload Document
                </label>
                <input
                  type="file"
                  name="documentPdfFile"
                  className="w-full border border-gray-300 p-2 rounded"
                  onChange={handleFileUpload}
                  // onChange={async (e) => {
                  //   const file = e.target.files[0];
                  //   if (file) {
                  //     try {
                  //       const base64String = await convertImageToBase64(file);
                  //       console.log("Base64:", base64String);
                  //       setFormData({
                  //         ...formData,
                  //         documentPdfFile: file,
                  //       });
                  //     } catch (error) {
                  //       console.error("Error converting image:", error);
                  //     }
                  //   }
                  // }}
                />
                {formData.documentPdfFile && (
                  <div className="mt-2">
                    <div className="w-[90px] h-[90px] border border-gray-300 rounded flex items-center justify-center overflow-hidden">
                      <img
                        src={formData.documentPdfFile}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">
                  Upload Vehicle Images *
                </label>
                <input
                  type="file"
                  name="image"
                  className="w-full border border-gray-300 p-2 rounded"
                  // onChange={handleFileUpload}
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      try {
                        const base64String = await convertImageToBase64(file);
                        console.log("Base64:", base64String);
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
                {formData.image && (
                  <div className="mt-2">
                    <div className="w-[90px] h-[90px] border border-gray-300 rounded flex items-center justify-center overflow-hidden">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
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
          {/* Search Bar */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search..."
                className="border border-gray-300 rounded-l px-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}

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
                  {/* <th scope="col" className="px-6 py-3">
                    Added By
                  </th> */}
                  <th scope="col" className="px-6 py-3">
                    Status
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
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No data Found
                    </td>
                  </tr>
                ) : (
                  data.map((bike) => (
                    <tr
                      key={bike.id}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">{bike.id}</td>
                      <td className="px-6 py-4">{bike.brand}</td>
                      <td className="px-6 py-4">{bike.category}</td>
                      <td className="px-6 py-4">{bike.model}</td>
                      <td className="px-6 py-4">
                        {bike.vehicleRegistrationNumber}
                      </td>
                      {/* <td className="px-6 py-4">{bike.addedBy}</td> */}
                      <td className="px-6 py-4">
                        <button
                          className={`px-2 py-1 rounded ${
                            statuses.find((row) => row.id === bike.id)
                              ?.status === "Active"
                              ? "bg-green-600 hover:bg-green-600 text-white"
                              : "bg-red-700 hover:bg-red-600 text-white"
                          }`}
                          onClick={() => toggleStatus(bike.id)}
                        >
                          {statuses.find((row) => row.id === bike.id)?.status ??
                            "Active"}
                        </button>
                      </td>

                      <td className="px-6 py-4 ">
                        <button
                          onClick={() => handleEditBike(bike)}
                          className="px-4 py-2 flex items-center text-white bg-blue-800 hover:bg-blue-600 rounded mr-2"
                        >
                          <FaEdit className="mr-2" />
                          Edit
                        </button>
                        <button
                          className="px-4 py-2 text-white bg-red-800 hover:bg-red-600 rounded"
                          onClick={() => setConfirmDeleteId(bike.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Delete Confirmation  */}
          {confirmDeleteId && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded shadow-lg">
                <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
                <p className="mb-4">
                  Are you sure you want to delete this Store?
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

          {/* Pagination */}
          <div className="flex justify-end items-center mt-6">
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(0)} // Jump to the first page
              disabled={page === 0}
              className={`px-4 py-2 text-sm rounded ${
                page === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-900 text-white hover:bg-blue-600"
              }`}
            >
              First
            </button>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
              className={`px-4 py-2 text-sm rounded ${
                page === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-900 text-white hover:bg-blue-600"
              }`}
            >
              Previous
            </button>
            <p className="px-4 py-2 text-sm text-gray-500 flex items-center">
              Page {page + 1} of {totalPages}
            </p>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page + 1 >= totalPages}
              className={`px-4 py-2 text-sm rounded ${
                page + 1 >= totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-900 text-white hover:bg-blue-600"
              }`}
            >
              Next
            </button>
            <button
              onClick={() => handlePageChange(totalPages - 1)} // Jump to the last page
              disabled={page + 1 >= totalPages}
              className={`px-4 py-2 text-sm rounded ${
                page + 1 >= totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-900 text-white hover:bg-blue-600"
              }`}
            >
              Last
            </button>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

// export default Bikes;





// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { FaEdit } from "react-icons/fa";
// import apiClient from "../api/apiConfig";

// function convertImageToBase64(file) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       resolve(reader.result);
//     };
//     reader.onerror = (error) => {
//       reject(error);
//     };
//     reader.readAsDataURL(file);
//   });
// }

// const StoreMaster = () => {
//   const [data, setData] = useState([]);
//   const [statuses, setStatuses] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [formVisible, setFormVisible] = useState(false); // Form state
//   const [editingId, setEditingId] = useState(null);
//   const [confirmDeleteId, setConfirmDeleteId] = useState(null);
//   const [formData, setFormData] = useState({
//     storeName: "",
//     storeOwner: "",
//     storePhone: "",
//     storeAddress: "",
//     cityId: "",
//     subCityId: "", // Add state for subcity/area
//     mapUrl: " ",
//     storeEmail: " ",
//     image: " ",
//   });
//   const [loading, setLoading] = useState(true);
//   const [itemsPerPage] = useState(5);
//   const [cities, setCities] = useState([]); // New state for cities
//   const [subcities, setSubcities] = useState([]); // State for subcities/areas

//   //Fetch store data
//   useEffect(() => {
//     const fetchStores = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get("http://localhost:8080/store/all");
//         console.log({ response });
//         setData(response.data);
//         setStatuses(
//           response.data.content.map((item) => ({
//             id: item.id,
//             status: "Active",
//           }))
//         );
//       } catch (error) {
//         console.error("Error fetchig store data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStores();
//   }, []);

//   // Fetch city data
//   useEffect(() => {
//     const fetchCities = async () => {
//       try {
//         const response = await axios.get("http://localhost:8080/store/all");
//         setCities(response.data.content); // Extract only names;
//       } catch (error) {
//         console.error("Error fetching city data:", error);
//       }
//     };
//     fetchCities();
//   }, []);

//   console.log(cities);

//   const fetchSubcities = async (id) => {
//     if (id) {
//       try {
//         const response = await axios.get(
//           `http://localhost:8080/subcity/bycityid/${id}`
//         );
//         setSubcities(response.data); // Update subcities state
//       } catch (error) {
//         console.error("Error fetching subcities:", error);
//       }
//     }
//   };

//   //Add Store
//   const handledAddStore = (e) => {
//     e.preventDefault();
//     axios
//       .post("http://localhost:8080/store/add", formData)
//       .then((response) => {
//         setData([...data, response.data]);
//         resetForm();
//       })
//       .catch((error) => console.error("Error adding store data", error));
//   };

//   //Save Edit
//   const handleSaveEdit = (e) => {
//     e.preventDefault();
//     axios;
//     apiClient
//       .put(`/stores/${editingId}`, formData)
//       .then((response) => {
//         setData(
//           data.map((store) => (store.id === editingId ? response.data : store))
//         );
//         resetForm();
//       })
//       .catch((error) => console.error("Error Saving Data:", error));
//   };

//   //Edit store
//   const handleEditStore = (store) => {
//     setEditingId(store.id);
//     setFormData({
//       storeName: store.storeName,
//       storeOwner: store.storeOwner,
//       storePhone: store.storePhone,
//       storeAddress: store.storeAddress,
//       cityId: store.cityId,
//       subCityId: store.subCityId, // Add state for subcity/area
//       mapUrl: store.mapUrl,
//       storeEmail: store.storeEmail,
//       image: store.image,
//     });
//     setFormVisible(true);
//   };

//   //Delete Store
//   const handleDeleteStore = (id) => {
//     axios;
//     apiClient
//       .delete(`/stores/${id}`)
//       .then(() => setData(data.filter((store) => store.id !== id)))
//       .catch((error) => console.error("Error deleting data:", error))
//       .finally(() => setConfirmDeleteId(null));
//   };

//   //Reset Form
//   const resetForm = () => {
//     setEditingId(null);
//     setFormData({
//       storeName: "",
//       storeOwner: "",
//       storePhone: "",
//       storeAddress: "",
//       cityId: "",
//       subCityId: "", // Add state for subcity/area
//       mapUrl: " ",
//       storeEmail: " ",
//       image: " ",
//     });
//     setFormVisible(false);
//   };

//   // Filtered data based on search query
//   const filteredData = data.filter(
//     (item) => item.storeName.toLowerCase().includes(searchQuery.toLowerCase()) // Fix here
//   );

//   // Pagination logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//   // Toggle status function
//   const toggleStatus = (id) => {
//     setStatuses((prevStatuses) =>
//       prevStatuses.map((row) =>
//         row.id === id
//           ? { ...row, status: row.status === "Active" ? "Inactive" : "Active" }
//           : row
//       )
//     );
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">All Store List</h1>
//         {!formVisible && (
//           <button
//             onClick={() => setFormVisible(true)}
//             className="px-4 py-2 bg-blue-900 text-white rounded-r hover:bg-blue-600"
//           >
//             + Add Store
//           </button>
//         )}
//       </div>

//       {/* formVisible */}
//       {formVisible ? (
//         // <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <h2 className="text-xl font-bold mb-4">
//             {editingId ? "Edit Store" : "Add New Store"}
//           </h2>
//           <form onSubmit={editingId ? handleSaveEdit : handledAddStore}>
//             <div className="grid grid-cols-3 gap-4">
//               <div className="col-span-2 sm:col-span-1">
//                 <label className="font-medium">Store Name</label>
//                 <input
//                   type="text"
//                   name="storeName"
//                   placeholder="Enter Store Name"
//                   className="border p-2 rounded w-full"
//                   value={formData.storeName}
//                   onChange={(e) =>
//                     setFormData({ ...formData, storeName: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block mb-2 font-medium">Store Owner</label>
//                 <input
//                   type="text"
//                   name="storeOwner"
//                   className="w-full border border-gray-300 p-2 rounded"
//                   value={formData.storeOwner}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       storeOwner: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block mb-2 font-medium">Contact Number</label>
//                 <input
//                   type="number"
//                   name="storeContactNumber"
//                   className="w-full border border-gray-300 p-2 rounded"
//                   value={formData.storePhone}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       storePhone: e.target.value,
//                     })
//                   }
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block mb-2 font-medium">Address</label>
//                 <input
//                   type="text"
//                   name="address"
//                   className="w-full border border-gray-300 p-2 rounded"
//                   value={formData.address}
//                   onChange={(e) =>
//                     setFormData({ ...formData, address: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block mb-2 font-medium">City</label>
//                 <select
//                   name="city"
//                   className="w-full border border-gray-300 p-2 rounded"
//                   value={formData.city}
//                   onChange={(e) => {
//                     setFormData({ ...formData, city: e.target.value });
//                     fetchSubcities(e.target.value);
//                   }}
//                 >
//                   <option value="" disabled>
//                     Select a city
//                   </option>
//                   {cities.map((city) => (
//                     <option key={city.id} value={city.id}>
//                       {city.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Subcity Dropdown */}
//               <div className="mb-4">
//                 <label className="block mb-2 font-medium">Subcity/Area</label>
//                 <select
//                   name="subcity"
//                   className="w-full border border-gray-300 p-2 rounded"
//                   value={formData.subcity}
//                   onChange={(e) =>
//                     setFormData({ ...formData, subcity: e.target.value })
//                   }
//                   disabled={!formData.city} // Disable if no city is selected
//                 >
//                   <option value="" disabled>
//                     Select a subcity/area
//                   </option>
//                   {subcities.map((subcity) => (
//                     <option key={subcity.id} value={subcity.id}>
//                       {subcity.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="mb-4">
//                 <label className="block mb-2 font-medium">Google Map URL</label>
//                 <input
//                   type="text"
//                   name="mapUrl"
//                   className="w-full border border-gray-300 p-2 rounded"
//                   value={formData.mapUrl}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       mapUrl: e.target.value,
//                     })
//                   }
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block mb-2 font-medium">Store Photos</label>
//                 <input
//                   type="file"
//                   name="image"
//                   className="w-full border border-gray-300 p-2 rounded"
//                   onChange={async (e) => {
//                     const file = e.target.files[0];
//                     if (file) {
//                       try {
//                         const base64String = await convertImageToBase64(file);
//                         console.log("Base64:", base64String);
//                         setFormData({
//                           ...formData,
//                           image: base64String,
//                         });
//                       } catch (error) {
//                         console.error("Error converting image:", error);
//                       }
//                     }
//                   }}
//                 />
//                 {formData.image && (
//                   <div className="mt-2">
//                     <div className="w-[90px] h-[90px] border border-gray-300 rounded flex items-center justify-center overflow-hidden">
//                       <img
//                         src={formData.image}
//                         alt="Preview"
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="flex justify-end">
//               <button
//                 type="submit"
//                 className="px-4 py-2 mr-2 text-white bg-blue-900 rounded hover:bg-blue-600"
//               >
//                 {editingId ? "Save" : "Add"}
//               </button>
//               <button
//                 type="button"
//                 className="ml-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//                 onClick={resetForm}
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       ) : (
//         // </div>

//         <div className="bg-white p-6 shadow-md rounded-lg">
//           {/* Search Bar */}
//           <div className="flex justify-between items-center mb-4">
//             <div className="flex items-center">
//               <input
//                 type="text"
//                 placeholder="Search by Store Name..."
//                 className="border border-gray-300 rounded-l px-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Table */}
//           <div className="relative overflow-x-auto">
//             <table className="w-full text-sm text-left text-gray-500">
//               <thead className="text-xs text-gray-700 uppercase bg-gray-200">
//                 <tr>
//                   <th scope="col" className="px-6 py-3">
//                     ID
//                   </th>
//                   <th scope="col" className="px-6 py-3">
//                     Store Image
//                   </th>
//                   <th scope="col" className="px-6 py-3">
//                     Store Name
//                   </th>
//                   <th scope="col" className="px-6 py-3">
//                     Contact Number
//                   </th>
//                   <th scope="col" className="px-6 py-3">
//                     Address
//                   </th>
//                   <th scope="col" className="px-6 py-3">
//                     Status
//                   </th>
//                   <th scope="col" className="px-6 py-3">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="6" className="text-center py-4">
//                       Loading...{" "}
//                     </td>
//                   </tr>
//                 ) : currentData.length === 0 ? (
//                   <tr>
//                     <td colSpan="6" className="text-center py-4">
//                       No data found
//                     </td>
//                   </tr>
//                 ) : (
//                   [].map((store) => (
//                     <tr
//                       key={store?.id}
//                       className="bg-white border-b hover:bg-gray-50"
//                     >
//                       <td className="px-6 py-4">{store?.id}</td>
//                       <td className="px-6 py-4">
//                         {store?.image ? (
//                           <img
//                             src={store?.image}
//                             alt="Uploaded Base64"
//                             style={{
//                               width: "80px",
//                               height: "80px",
//                               objectFit: "cover",
//                             }}
//                           />
//                         ) : (
//                           "-"
//                         )}
//                       </td>

//                       <td className="px-6 py-4">{store?.storeName}</td>
//                       <td className="px-6 py-4">{store?.storePhone}</td>
//                       <td className="px-6 py-4">
//                         <a
//                           href={store?.mapUrl}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-500 hover:underline"
//                         >
//                           {store?.storeAddress}
//                         </a>
//                       </td>

//                       <td className="px-6 py-4">
//                         <button
//                           className={`px-2 py-1 rounded ${
//                             statuses.find((row) => row.id === store?.id)
//                               ?.status === "Active"
//                               ? "bg-green-600 hover:bg-green-600 text-white"
//                               : "bg-red-700 hover:bg-red-600 text-white"
//                           }`}
//                           onClick={() => toggleStatus(store?.id)}
//                         >
//                           {statuses.find((row) => row.id === store?.id)
//                             ?.status ?? "Active"}
//                         </button>
//                       </td>

//                       <td className="px-6 py-4">
//                         <button
//                           className="px-4 py-2 flex items-center text-white bg-blue-800 hover:bg-blue-600 rounded mr-2"
//                           onClick={() => handleEditStore(store)}
//                         >
//                           <FaEdit className="mr-2" />
//                           Edit
//                         </button>
//                         <button
//                           className="px-4 py-2 text-white bg-red-800 hover:bg-red-600 rounded"
//                           onClick={() => setConfirmDeleteId(store?.id)}
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Delete Confirmation  */}
//           {confirmDeleteId && (
//             <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
//               <div className="bg-white p-6 rounded shadow-lg">
//                 <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
//                 <p className="mb-4">
//                   Are you sure you want to delete this Store?
//                 </p>
//                 <div className="flex justify-end space-x-4">
//                   <button
//                     className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-700"
//                     onClick={() => handleDeleteStore(confirmDeleteId)}
//                   >
//                     Yes, Delete
//                   </button>
//                   <button
//                     className="bg-gray-500 text-white px-4 py-2 rounded shadow-md hover:bg-gray-700"
//                     onClick={() => setConfirmDeleteId(null)}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Pagination */}
//           <div className="flex justify-between items-center mt-6">
//             <p className="text-sm text-gray-500">
//               Showing {indexOfFirstItem + 1}to{" "}
//               {Math.min(indexOfLastItem, filteredData.length)} of{" "}
//               {filteredData.length} entries
//             </p>
//             <div className="flex space-x-2">
//               <button
//                 className="px-4 py-2 text-sm text-white bg-blue-900 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage((prev) => prev - 1)}
//               >
//                 Previous
//               </button>
//               {[...Array(totalPages)].map((_, index) => (
//                 <button
//                   key={index}
//                   className={`px-4 py-2 rounded ${
//                     currentPage === index + 1
//                       ? "bg-blue-900 text-white"
//                       : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                   }`}
//                   onClick={() => setCurrentPage(index + 1)}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//               <button
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage((prev) => prev + 1)}
//                 className={`px-4 py-2 rounded ${
//                   currentPage === totalPages
//                     ? "bg-gray-300 text-gray-500"
//                     : "bg-blue-900 text-white hover:bg-blue-600"
//                 }`}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StoreMaster;

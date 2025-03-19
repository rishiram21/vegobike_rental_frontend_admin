import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";

function convertImageToBase64(file) {
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
  console.log({data});
  const [statuses, setStatuses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formVisible, setFormVisible] = useState(false); //FORM State
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  // const [currentBike, setCurrentBike] = useState(null);
  const [formData, setFormData] = useState({
    vehicleBrandId: "",
    vehicleModelId: "",
    vehicleCategoryId: "",
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
  const [itemsPerPage] = useState(5);

  const [brands, setBrands] = useState([]) //for the brands
  const [categories, setCategories] = useState([]) //for the categories
  const [models, setModels] = useState([]) //for the models
  const [stores, setStores] = useState([]) //for the stores
  const [fuel, setFuel] = useState ([]) //for the fule

  // Fetch Bike data
  useEffect(() => {
    const fetchBikes = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/vehicle/all");
        console.log("fetched bike data:", response.data);
        if (Array.isArray(response.data.content)) {
          setData(response.data.content);
        } else {
          console.error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetchig bike data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBikes();
  }, []);

  //Fetch brand data
  useEffect(()=>{
    const fetchBrands = async () => {
      try{
        const response = await axios.get("http://localhost:8080/brand/all")
        setBrands(response.data.content);
      }catch(error){
        console.error("Error fetching brand data:", error);
      }
    }
    fetchBrands();
  },[])

  
  //Fetch models data
  useEffect( ()=>{
    const fetchModels = async ()=>{
      try {
        const response = await axios.get("")
        setModels(response.data.content);      
      } catch (error) {
        console.error("Error fetching model data:",error)
      }
    }
    fetchModels();
  },[])

  
  //Fetch category data
  useEffect( ()=>{
    const fetchCategory = async ()=>{
    try {
      const response = await axios.get("http://localhost:8080/category/all")
      setCategories(response.data.content);      
    } catch (error) {
      console.error("Error fetching category data:",error)
    }
  }
  fetchCategory();
  },[])

  //Fetch store data
  useEffect( async()=>{
    const fetchStores = async()=>{
      try {
        const response = await axios.get("http://localhost:8080/store/all")
        setStores(response.data.content);      
      } catch (error) {
        console.error("Error fetching stores data:",error)
      }
    }
    fetchStores();
  },[])

  //Fetch fuel data
  useEffect( async()=>{
    const fetchFuel = async()=>{
      try {
        const response = await axios.get("")
        setFuel(response.data.content);      
      } catch (error) {
        console.error("Error fetching stores data:",error)
      }
    }
    fetchFuel();
  },[])


  // Add Bike
  const handleAddBike = (e) => {
    e.preventDefault();
    console.log(formData)
    axios
      .post("http://localhost:8080/vehicle/add", formData)
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
      .catch((error) => ("Error Addding Bike Data", error));
  };

  //Save Edit Bike
  const handleSaveEdit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:8080/api/bikes/${editingId}`, formData)
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
      vehicleModelId: bike.vehicleModelId,
      vehicleCategoryId: bike,vehicleCategoryId,
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
      vehicleModelId: "",
      vehicleCategoryId: "",
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
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  console.log(indexOfFirstItem, indexOfLastItem, currentData, filteredData);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
                  onChange={(e) =>
                    setFormData({ ...formData, vehicleBrandId: e.target.value })
                  }
                >
                <option value="">
                  Select Brand 
                </option>
                {
                  brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>  
                  ))
                }
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="font-medium">Category Name *</label>
                <input
                  type="text"
                  name="category"
                  placeholder="Enter Category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="font-medium">Model Name *</label>
                <input
                  type="text"
                  name="modelName"
                  placeholder="Enter Model Name"
                  value={formData.modelName}
                  onChange={(e) =>
                    setFormData({ ...formData, modelName: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
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
                  name="vehicleChassisNumber"
                  placeholder="Enter Vehicle Chassis Number"
                  value={formData.vehicleChassisNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vehicleChassisNumber: e.target.value,
                    })
                  }
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="font-medium">Vehicle Engine Number *</label>
                <input
                  type="text"
                  name="vehicleEngineNumber"
                  placeholder="Enter Vehicle Engine Number"
                  value={formData.vehicleEngineNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vehicleEngineNumber: e.target.value,
                    })
                  }
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="font-medium">Store Name *</label>
                <input
                  type="text"
                  name="storeName"
                  placeholder="Enter storeName"
                  value={formData.storeName}
                  onChange={(e) =>
                    setFormData({ ...formData, storeName: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium">Upload PUC</label>
                <input
                  type="file"
                  name="puc"
                  className="w-full border border-gray-300 p-2 rounded"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      try {
                        const base64String = await convertImageToBase64(file);
                        console.log("Base64:", base64String);
                        setFormData({
                          ...formData,
                          puc: base64String,
                        });
                      } catch (error) {
                        console.error("Error converting image:", error);
                      }
                    }
                  }}
                />
                {formData.puc && (
                  <div className="mt-2">
                    <div className="w-[90px] h-[90px] border border-gray-300 rounded flex items-center justify-center overflow-hidden">
                      <img
                        src={formData.puc}
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
                  name="insurance"
                  className="w-full border border-gray-300 p-2 rounded"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      try {
                        const base64String = await convertImageToBase64(file);
                        console.log("Base64:", base64String);
                        setFormData({
                          ...FormData,
                          insurance: base64String,
                        });
                      } catch (error) {
                        console.error("Error converting image:", error);
                      }
                    }
                  }}
                />
                {formData.insurance && (
                  <div className="mt-2">
                    <div className="w-[90px] h-[90px] border border-gray-300 rounded flex items-center justify-center overflow-hidden">
                      <img
                        src={formData.insurance}
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
                  name="document"
                  className="w-full border border-gray-300 p-2 rounded"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      try {
                        const base64String = await convertImageToBase64(file);
                        console.log("Base64:", base64String);
                        setFormData({
                          ...formData,
                          document: base64String,
                        });
                      } catch (error) {
                        console.error("Error converting image:", error);
                      }
                    }
                  }}
                />
                {formData.document && (
                  <div className="mt-2">
                    <div className="w-[90px] h-[90px] border border-gray-300 rounded flex items-center justify-center overflow-hidden">
                      <img
                        src={formData.document}
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
                  name="vehicleImage"
                  className="w-full border border-gray-300 p-2 rounded"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      try {
                        const base64String = await convertImageToBase64(file);
                        console.log("Base64:", base64String);
                        setFormData({
                          ...formData,
                          vehicleImage: base64String,
                        });
                      } catch (error) {
                        console.error("Error converting image:", error);
                      }
                    }
                  }}
                />
                {formData.vehicleImage && (
                  <div className="mt-2">
                    <div className="w-[90px] h-[90px] border border-gray-300 rounded flex items-center justify-center overflow-hidden">
                      <img
                        src={formData.vehicleImage}
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
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-500">
              Showing {indexOfFirstItem + 1}to{" "}
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
      )}
    </div>
  );
};

// export default Bikes;

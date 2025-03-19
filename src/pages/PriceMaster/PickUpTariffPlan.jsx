import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const PickUpTariffPlan = () => {
  const [data, setData] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    vehicleCategoryId: "",
    periodType: "Hours", // Default to Hours
    periodValue: "",
    price: "",
    deposit: "",
  });
  const [loading, setLoading] = useState(true);
  const [category, setCategories] = useState([]);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchPickUpTariffPrices = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/package/all");
        if (Array.isArray(response.data.content)) {
          setData(response.data.content);
        } else {
          console.error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching price data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPickUpTariffPrices();
    fetchCategory();
  }, []);

  const handleAddPrice = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/package/add", formData)
      .then((response) => {
        if (!Array.isArray(data)) {
          setData([response.data]);
        } else {
          setData([...data, response.data]);
        }
        resetForm();
      })
      .catch((error) => console.error("Error adding package data", error));
  };

  const fetchCategory = async () => {
    try {
      const response = await axios.get("http://localhost:8080/category/all");
      setCategories(response.data.content);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:8080/package/${editingId}`, formData)
      .then((response) => {
        setData(
          data.map((pickUpTariffplan) =>
            pickUpTariffplan.id === editingId ? response.data : pickUpTariffplan
          )
        );
        resetForm();
      })
      .catch((error) => console.error("Error Saving Data:", error));
  };

  const handleEditTariffPlan = (pickuptariffplan) => {
    setEditingId(pickuptariffplan.id);
    setFormData({
      vehicleCategoryId: pickuptariffplan.vehicleCategoryId,
      periodType: pickuptariffplan.hours ? "Hours" : "Days",
      periodValue: pickuptariffplan.hours || pickuptariffplan.days,
      price: pickuptariffplan.price,
      deposit: pickuptariffplan.deposit,
    });
    setFormVisible(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      vehicleCategoryId: "",
      periodType: "Hours",
      periodValue: "",
      price: "",
      deposit: "",
    });
    setFormVisible(false);
  };

  const handleDeletepackage = (id) => {
    axios
      .delete(`http://localhost:8080/package/${id}`)
      .then(() => setData(data.filter((model) => model.id !== id)))
      .catch((error) => console.error("Error deleting data:", error))
      .finally(() => setConfirmDeleteId(null));
  };

  const filteredData = data.filter(
    (item) =>
      item.vehicleCategory &&
      item.vehicleCategory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="p-6 bg-gray-100 min-h-screen mt-14">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Price List</h1>
        {!formVisible && (
          <button
            onClick={() => setFormVisible(true)}
            className="px-4 py-2 bg-blue-900 text-white rounded-r hover:bg-blue-600"
          >
            + Add Price
          </button>
        )}
      </div>

      {formVisible ? (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? "Edit PickUpTariffPlan" : " Add New PickUpTariffPlan"}
          </h2>
          <form onSubmit={editingId ? handleSaveEdit : handleAddPrice}>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="font-medium">Select Category *</label>
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
                  {category?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="font-medium">Select Period Type *</label>
                <select
                  name="periodType"
                  className="border p-2 rounded w-full"
                  value={formData.periodType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      periodType: e.target.value,
                    })
                  }
                >
                  <option value="Hours">Hours</option>
                  <option value="Days">Days</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">
                  {formData.periodType}
                </label>
                <input
                  type="number"
                  name="periodValue"
                  className="w-full border border-gray-300 p-2 rounded"
                  value={formData.periodValue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      periodValue: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Amount</label>
                <input
                  type="number"
                  name="price"
                  className="w-full border border-gray-300 p-2 rounded"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Deposit Amount</label>
                <input
                  type="number"
                  name="deposit"
                  className="w-full border border-gray-300 p-2 rounded"
                  value={formData.deposit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      deposit: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 mr-2 text-white bg-blue-900 rounded hover:bg-blue-600"
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
                placeholder="Search..."
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
                    Vehicle Category Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Hours
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Days
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Deposit
                  </th>
                  <th scope="col" className="px-6 py-3"></th>
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
                      No data found
                    </td>
                  </tr>
                ) : (
                  currentData?.map((pickuptariffplan) => (
                    <tr
                      key={pickuptariffplan.id}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">{pickuptariffplan.id}</td>
                      <td className="px-6 py-4">
                        {pickuptariffplan?.vehicleCategory}
                      </td>
                      <td className="px-6 py-4">{pickuptariffplan?.hours}</td>
                      <td className="px-6 py-4">{pickuptariffplan?.days}</td>
                      <td className="px-6 py-4">{pickuptariffplan?.price}</td>
                      <td className="px-6 py-4">{pickuptariffplan?.deposit}</td>
                      <td className="px-6 py-4"></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <button
                            className="px-4 py-2 flex items-center text-white bg-blue-800 hover:bg-blue-600 rounded"
                            onClick={() =>
                              handleEditTariffPlan(pickuptariffplan)
                            }
                          >
                            <FaEdit className="mr-2" />
                            Edit
                          </button>
                          <button
                            className="px-4 py-2 flex items-center text-white bg-red-800 hover:bg-red-600 rounded"
                            onClick={() =>
                              setConfirmDeleteId(pickuptariffplan.id)
                            }
                          >
                            <FaTrash />
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

export default PickUpTariffPlan;

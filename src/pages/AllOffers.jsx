import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import apiClient from "../api/apiConfig";
import { YoutubeIcon } from "lucide-react";

const Allcoupons = () => {
  const [data, setData] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    couponName: "",
    couponCode: "",
    couponType: "",
    discountValue: "",
    minimumRideAmount: "",
    totalCoupon: "",
    remainingCoupon: "",
    isActive: true,
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    const fetchCoupons = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/coupons/all");
        setData(response.data);
        setStatuses(
          response.data.map((item) => ({ id: item.couponId, status: item.isActive ? "Active" : "Inactive" }))
        );
      } catch (error) {
        console.error("Error fetching coupon data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const handledAddcoupon = (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      couponType: formData.couponType || "FIXED_VALUE", // Default value
      isActive: formData.isActive ?? true, // Ensure isActive is not null
    };
    apiClient
      .post("/coupons/add", updatedFormData)
      .then((response) => {
        setData([...data, response.data]);
        resetForm();
        window.location.reload();
      })
      .catch((error) => console.error("Error adding coupon data", error));
  };

  const handleSaveEditCoupon = (e) => {
    e.preventDefault();
    apiClient
      .put(`/coupons/updateId/${editingId}`, formData)
      .then((response) => {
        setData(
          data.map((coupon) => (coupon.couponId === editingId ? response.data : coupon))
        );
        resetForm();
      })
      .catch((error) => console.error("Error saving data:", error));
  };

  const handleEditCoupon = (coupon) => {
    setEditingId(coupon.couponId);
    setFormData({
      couponName: coupon.couponName,
      couponCode: coupon.couponCode,
      couponType: coupon.couponType,
      discountValue: coupon.discountValue,
      minimumRideAmount: coupon.minimumRideAmount,
      totalCoupon: coupon.totalCoupon,
      remainingCoupon: coupon.remainingCoupon,
      isActive: coupon.isActive,
      startDate: coupon.startDate,
      endDate: coupon.endDate,
    });
    setFormVisible(true);
  };

  const handleDeleteCoupon = (id) => {
    apiClient
      .delete(`/coupons/deleteId/${id}`)
      .then(() => setData(data.filter((coupon) => coupon.couponId !== id)))
      .catch((error) => console.error("Error deleting data:", error))
      .finally(() => setConfirmDeleteId(null));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      couponName: "",
      couponCode: "",
      couponType: "",
      discountValue: "",
      minimumRideAmount: "",
      totalCoupon: "",
      remainingCoupon: "",
      isActive: true,
      startDate: "",
      endDate: "",
    });
    setFormVisible(false);
  };

  const filteredData = data.filter((item) => {
    if (!item.couponName) {
      return false;
    }
    return item.couponName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Calculate the starting serial number for the current page
  const startingSerialNumber = indexOfFirstItem + 1;

  const toggleStatus = (id, currentStatus) => {
    const newStatus = !currentStatus;
    apiClient
      .put(`/coupons/update-status/${id}`, null, { params: { isActive: newStatus } })
      .then(() => {
        setStatuses((prevStatuses) =>
          prevStatuses.map((row) =>
            row.id === id ? { ...row, status: newStatus ? "Active" : "Inactive" } : row
          )
        );
      })
      .catch((error) => console.error("Error updating status:", error));
  };

  return (
    <div className=" bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mt-4 mb-4">
        <h1 className="text-xl font-bold text-gray-800 md:text-2xl">All Coupon List</h1>
        {!formVisible && (
          <button
            onClick={() => setFormVisible(true)}
            className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-600"
          >
            + Add Coupon
          </button>
        )}
      </div>

      {formVisible ? (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4 md:text-xl">
            {editingId ? "Edit Coupon" : "Add New Coupon"}
          </h2>
          <form onSubmit={editingId ? handleSaveEditCoupon : handledAddcoupon}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block mb-2 font-medium">Coupon Name</label>
                <input
                  type="text"
                  name="couponName"
                  placeholder="Enter coupon name"
                  className="border p-2 rounded w-full"
                  value={formData.couponName}
                  onChange={(e) =>
                    setFormData({ ...formData, couponName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-span-1">
                <label className="block mb-2 font-medium">Coupon Code</label>
                <input
                  type="text"
                  name="couponCode"
                  className="w-full border border-gray-300 p-2 rounded"
                  value={formData.couponCode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      couponCode: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="col-span-1">
                <label className="block mb-2 font-medium">Discount Type</label>
                <select
                  name="couponType"
                  className="w-full border border-gray-300 p-2 rounded"
                  value={formData.couponType}
                  onChange={(e) =>
                    setFormData({ ...formData, couponType: e.target.value })
                  }
                  required
                >
                  <option value="FIXED_VALUE">Fixed Amount</option>
                  <option value="PERCENTAGE">Percentage</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="block mb-2 font-medium">Discount Value</label>
                <input
                  type="text"
                  name="discountValue"
                  className="w-full border border-gray-300 p-2 rounded"
                  value={formData.discountValue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountValue: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="col-span-1">
                <label className="block mb-2 font-medium">
                  Minimum Ride Amount
                </label>
                <input
                  type="text"
                  name="minimumRideAmount"
                  className="w-full border border-gray-300 p-2 rounded"
                  value={formData.minimumRideAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minimumRideAmount: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-span-1">
                <label className="block mb-2 font-medium">
                  Total Coupons
                </label>
                <input
                  type="text"
                  name="totalCoupon"
                  className="w-full border border-gray-300 p-2 rounded"
                  value={formData.totalCoupon}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalCoupon: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-span-1">
                <label className="block mb-2 font-medium">
                  Remaining Coupons
                </label>
                <input
                  type="text"
                  name="remainingCoupon"
                  className="w-full border border-gray-300 p-2 rounded"
                  value={formData.remainingCoupon}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      remainingCoupon: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-span-1">
                <label className="block mb-2 font-medium">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  className="w-full border border-gray-300 p-2 rounded"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      startDate: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="col-span-1">
                <label className="block mb-2 font-medium">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  className="w-full border border-gray-300 p-2 rounded"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      endDate: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="col-span-1">
                <label className="block mb-2 font-medium">Status</label>
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
        <div className="bg-white p-4 shadow-md rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search By Coupon Name..."
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                <tr>
                  <th scope="col" className="px-4 py-2">
                    SR. NO.
                  </th>
                  <th scope="col" className="px-4 py-2">
                    Coupon Name
                  </th>
                  <th scope="col" className="px-4 py-2">
                    Coupon Code
                  </th>
                  <th scope="col" className="px-4 py-2">
                    Discount
                  </th>
                  <th scope="col" className="px-4 py-2">
                    Total Coupons
                  </th>
                  <th scope="col" className="px-4 py-2">
                    Remaining Coupons
                  </th>
                  <th scope="col" className="px-4 py-2">
                    Start Date
                  </th>
                  <th scope="col" className="px-4 py-2">
                    End Date
                  </th>
                  <th scope="col" className="px-4 py-2">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-2">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : currentData.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-4">
                      No data found
                    </td>
                  </tr>
                ) : (
                  currentData.map((coupon, index) => (
                    <tr
                      key={coupon.couponId}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">{startingSerialNumber + index}</td>
                      <td className="px-4 py-3">{coupon.couponName}</td>
                      <td className="px-4 py-3">{coupon.couponCode}</td>
                      <td className="px-4 py-3">{coupon.discountValue}</td>
                      <td className="px-4 py-3">{coupon.totalCoupon}</td>
                      <td className="px-4 py-3">{coupon.remainingCoupon}</td>
                      <td className="px-4 py-3">{coupon.startDate}</td>
                      <td className="px-4 py-3">{coupon.endDate}</td>
                      <td className="px-4 py-3">
                        <button
                          className={`px-2 py-1 rounded ${
                            coupon.isActive ? "bg-green-600 hover:bg-green-600 text-white" : "bg-red-700 hover:bg-red-600 text-white"
                          }`}
                          onClick={() => toggleStatus(coupon.couponId, coupon.isActive)}
                        >
                          {coupon.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <button
                            className="px-3 py-1 flex items-center text-white bg-blue-800 hover:bg-blue-600 rounded"
                            onClick={() => handleEditCoupon(coupon)}
                          >
                            <FaEdit className="mr-1" />
                            Edit
                          </button>
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
                  Are you sure you want to delete this coupon?
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-700"
                    onClick={() => handleDeleteCoupon(confirmDeleteId)}
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
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredData.length)} of{" "}
              {filteredData.length} entries
            </p>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 text-sm text-white bg-blue-900 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 rounded ${
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
                className={`px-3 py-1 rounded ${
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

export default Allcoupons;
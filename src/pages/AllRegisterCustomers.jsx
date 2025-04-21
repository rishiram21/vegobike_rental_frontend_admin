import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import apiClient from "../api/apiConfig";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllRegisterCustomers = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentStatus, setDocumentStatus] = useState({
    aadharFrontSide: 'PENDING',
    aadharBackSide: 'PENDING',
    drivingLicense: 'PENDING',
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/users/all", {
          params: {
            page: currentPage - 1,
            size: itemsPerPage,
          },
        });

        // Remove the first user record
        const filteredData = response.data.content.slice(1);

        setData(filteredData);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentPage, itemsPerPage]);

  const filteredData = data.filter(
    (item) =>
      item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleView = (user) => {
    setSelectedUser(user);
    setViewMode(true);
    setDocumentStatus({
      aadharFrontSide: user.aadharFrontStatus || 'PENDING',
      aadharBackSide: user.aadharBackStatus || 'PENDING',
      drivingLicense: user.drivingLicenseStatus || 'PENDING',
    });
  };

  const handleBack = () => {
    setViewMode(false);
    setSelectedUser(null);
  };

  const handleImageClick = (imageData) => {
    if (!imageData) {
      console.log("No image data available");
      return;
    }

    console.log("Image data type:", typeof imageData);
    console.log("Image data length:", typeof imageData === 'string' ? imageData.length : 'not a string');

    // Make sure we're passing just the base64 data
    setSelectedImage(imageData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  const handleDocumentAction = async (docType, action) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized access.");
      return;
    }

    try {
      const response = await apiClient.put(
        `/booking/verify-documents/${selectedUser.id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            status: action,
            docType: docType,
          },
        }
      );

      if (response.status === 200) {
        setDocumentStatus((prevStatus) => ({
          ...prevStatus,
          [docType]: action,
        }));
        toast.success(`Document ${docType} ${action.toLowerCase()} successfully!`);
      } else {
        toast.error("Failed to update document status.");
      }
    } catch (error) {
      console.error("Error updating document status:", error);
      toast.error("Failed to update document status.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen mt-10">
      <ToastContainer />
      {viewMode ? (
        <div className="bg-white p-4 rounded shadow-lg">
          <h3 className="text-lg font-bold mb-4 md:text-xl">User Details</h3>
          <p><strong>Name:</strong> {selectedUser.name}</p>
          {/* <p><strong>Email:</strong> {selectedUser.email}</p> */}
          <p><strong>Phone Number:</strong> {selectedUser.phoneNumber}</p>
          <div className="flex space-x-4 mt-10">
            <ProfileImageDetail
              label="Aadhar Front Side"
              imageData={selectedUser.aadharFrontSide}
              status={documentStatus.aadharFrontSide}
              onVerify={() => handleDocumentAction('aadharFrontSide', 'APPROVED')}
              onReject={() => handleDocumentAction('aadharFrontSide', 'REJECTED')}
              onImageClick={handleImageClick}
            />
            <ProfileImageDetail
              label="Aadhar Back Side"
              imageData={selectedUser.aadharBackSide}
              status={documentStatus.aadharBackSide}
              onVerify={() => handleDocumentAction('aadharBackSide', 'APPROVED')}
              onReject={() => handleDocumentAction('aadharBackSide', 'REJECTED')}
              onImageClick={handleImageClick}
            />
            <ProfileImageDetail
              label="Driving License"
              imageData={selectedUser.drivingLicense}
              status={documentStatus.drivingLicense}
              onVerify={() => handleDocumentAction('drivingLicense', 'APPROVED')}
              onReject={() => handleDocumentAction('drivingLicense', 'REJECTED')}
              onImageClick={handleImageClick}
            />
          </div>
          <button
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded shadow-md hover:bg-gray-700"
            onClick={handleBack}
          >
            Back
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mt-4 mb-4">
            <h1 className="text-xl font-bold text-gray-800 md:text-2xl">All Registered Users List</h1>
          </div>

          <div className="bg-white p-4 shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search By User Name..."
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
                    <th scope="col" className="px-4 py-2">Sr. No.</th>
                    <th scope="col" className="px-4 py-2">Name</th>
                    {/* <th scope="col" className="px-4 py-2">Email</th> */}
                    <th scope="col" className="px-4 py-2">Phone Number</th>
                    <th scope="col" className="px-4 py-2">Action</th>
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
                    currentData.map((user, index) => (
                      <tr
                        key={user.id}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <td className="px-4 py-3">{indexOfFirstItem + index + 1}</td>
                        <td className="px-4 py-3">{user.name}</td>
                        {/* <td className="px-4 py-3">{user.email}</td> */}
                        <td className="px-4 py-3">{user.phoneNumber}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <button
                              className="px-3 py-1 flex items-center text-white bg-blue-800 hover:bg-blue-600 rounded"
                              onClick={() => handleView(user)}
                            >
                              <FaEye className="mr-1" />
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

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
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full relative">
            <button
              className="absolute top-3 right-3 text-gray-700 hover:text-gray-900 bg-gray-200 hover:bg-gray-300 rounded-full p-2 z-10"
              onClick={handleCloseModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="flex justify-center items-center p-4 min-h-[400px]">
              {selectedImage ? (
                <img
                  src={`data:image/png;base64,${selectedImage}`}
                  alt="Document"
                  className="max-w-full max-h-[70vh] object-contain border-4 border-gray-300 rounded shadow-lg"
                  onError={(e) => {
                    console.error("Image loading error");
                    e.target.onerror = null;
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
              ) : (
                <div className="text-xl text-gray-500">Unable to load image</div>
              )}
              <div className="hidden text-xl text-red-500 text-center">
                Error loading image. The image data may be invalid or corrupted.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileImageDetail = ({ label, imageData, status, onVerify, onReject, onImageClick }) => {
  const getImageSource = () => {
    if (!imageData) return null;
    if (typeof imageData === "string" && imageData.startsWith("data:image/")) {
      return imageData;
    }
    return `data:image/png;base64,${imageData}`;
  };

  const handleImageClick = () => {
    if (!imageData) return;

    // Ensure we're passing the raw base64 data without the data URL prefix
    const base64Data = typeof imageData === "string" && imageData.startsWith("data:image/")
      ? imageData.split(',')[1]
      : imageData;

    onImageClick(base64Data);
  };

  return (
    <div className="w-1/3 relative">
      <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
      <div
        className={`w-full h-64 bg-gray-50 border ${imageData ? 'border-blue-400 hover:border-blue-600' : 'border-gray-300'}
          flex items-center justify-center rounded-md overflow-hidden transition-all duration-300
          ${imageData ? 'cursor-pointer hover:shadow-lg' : 'cursor-default'}`}
        onClick={handleImageClick}
      >
        {imageData ? (
          <img
            src={getImageSource()}
            alt={label}
            className="max-w-full max-h-full object-contain p-2 border-2 border-gray-200 rounded"
            onError={(e) => {
              console.error(`Error loading ${label} image`);
              e.target.onerror = null;
              e.target.style.display = "none";
              // Create and show error message
              const errorText = document.createElement("p");
              errorText.textContent = "Invalid image data";
              errorText.className = "font-medium text-red-500";
              e.target.parentNode.appendChild(errorText);
            }}
          />
        ) : (
          <p className="font-medium text-gray-500">No Image</p>
        )}
      </div>
      {status && (
        <div className="mt-2 flex flex-col items-center space-y-2">
          <div className="bg-white p-2 rounded shadow text-xs absolute top-2 right-2">
            {status}
          </div>
          <div className="flex space-x-2 mt-4">
            <button
              className={`px-3 py-1 text-sm ${status === 'APPROVED' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'} rounded-md`}
              onClick={onVerify}
              disabled={status === 'APPROVED'}
            >
              Verify
            </button>
            <button
              className={`px-3 py-1 text-sm ${status === 'REJECTED' ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-700'} rounded-md`}
              onClick={onReject}
              disabled={status === 'REJECTED'}
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllRegisterCustomers;

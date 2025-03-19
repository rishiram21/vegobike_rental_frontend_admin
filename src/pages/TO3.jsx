import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
// import apiClient from "../api/apiConfig";

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

const StoreMaster = () => {
  const [data, setData] = useState([]);
  console.log({ data });
  const [statuses, setStatuses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formVisible, setFormVisible] = useState(false); // Form state
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    storeName: "",
    storeOwner: "",
    storePhone: "",
    storeAddress: "",
    cityId: "",
    subCityId: "", // Add state for subcity/area
    mapUrl: " ",
    storeEmail: " ",
    image: " ",
  });
  const [loading, setLoading] = useState(true);
  const [itemsPerPage] = useState(5);
  const [cities, setCities] = useState([]); // New state for cities
  const [subcities, setSubcities] = useState([]); // State for subcities/areas

  // //Fetch store data
  // useEffect(() => {
  //   const fetchStores = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await axios.get("http://localhost:8080/store/all");
  //       setData(response.data);
  //       setStatuses(
  //         response.data.map((item) => ({ id: item.id, status: "Active" }))
  //       );
  //     } catch (error) {
  //       console.error("Error fetchig store data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchStores();
  // }, []);

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/store/all");
        console.log("Fetched store data:", response.data);
        if (Array.isArray(response.data.content)) {
          setData(response.data.content);
        } else {
          console.error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching store data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  // Fetch city data
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get("http://localhost:8080/city/all");
        setCities(response.data.content); // Extract only names;
      } catch (error) {
        console.error("Error fetching city data:", error);
      }
    };
    fetchCities();
  }, []);

  console.log(cities);

  const fetchSubcities = async (id) => {
    if (id) {
      try {
        const response = await axios.get(
          `http://localhost:8080/subcity/bycityid/${id}`
        );
        setSubcities(response.data); // Update subcities state
      } catch (error) {
        console.error("Error fetching subcities:", error);
      }
    }
  };

  //Add Store
  const handledAddStore = (e) => {
    e.preventDefault();
    console.log(formData);
    // const payLoad = {
    //   storeName: formData?.storeName,
    //   storeOwner: formData?.storeOwner,
    //   storePhone: formData?.storePhone,
    //   storeAddress: formData?.storeAddress,
    //   cityId: formData?.city,
    //   subCityId: formData?.subCityId, // Add state for subcity/area
    //   mapUrl: formData?.mapUrl,
    //   storeEmail: formData?.storeEmail,
    //   image: formData?.storeImage,
    // };
    // console.log(payLoad);
    axios
      .post("http://localhost:8080/store/add", formData)
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
      .catch((error) => console.error("Error adding store data", error));
  };

  //Save Edit
  const handleSaveEdit = (e) => {
    e.preventDefault();
    console.log(formData);
    axios
      .put(`http://localhost:8080/store/${editingId}`, formData)
      .then((response) => {
        setData(
          data.map((store) => (store.id === editingId ? response.data : store))
        );
        resetForm();
      })
      .catch((error) => console.error("Error Saving Data:", error));
  };

  //Edit store
  const handleEditStore = (store) => {
    setEditingId(store.id);
    setFormData({
      storeName: store.storeName,
      storeOwner: store.storeOwner,
      storePhone: store.storePhone,
      storeAddress: store.storeAddress,
      cityId: store.cityId,
      subCityId: store.subCityId, // Add state for subcity/area
      mapUrl: store.mapUrl,
      storeEmail: store.storeEmail,
      image: store.image,
    });
    setFormVisible(true);
  };

  //Delete Store
  const handleDeleteStore = (id) => {
    axios;
    apiClient
      .delete(`/stores/${id}`)
      .then(() => setData(data.filter((store) => store.id !== id)))
      .catch((error) => console.error("Error deleting data:", error))
      .finally(() => setConfirmDeleteId(null));
  };

  //Reset Form
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      storeName: "",
      storeOwner: "",
      storePhone: "",
      storeAddress: "",
      cityId: "",
      subCityId: "", // Add state for subcity/area
      mapUrl: " ",
      storeEmail: " ",
      image: " ",
    });
    setFormVisible(false);
  };

  // Filtered data based on search query
  // const filteredData = data.filter(
  //   (item) => item.storeName.toLowerCase().includes(searchQuery.toLowerCase()) // Fix here
  // );
  // Filtered data based on search query
  // const filteredData = data.filter(
  //   (item) =>
  //     item.storeName && // Check if storeName exists
  //     item.storeName.toLowerCase().includes(searchQuery.toLowerCase())
  // );
  // Ensure `data` is an array
  const safeData = Array.isArray(data) ? data : [];

  // Filtered data based on search query
  const filteredData = safeData.filter(
    (item) =>
      item.storeName && // Check if storeName exists
      item.storeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // console.log("Filtered Data:", filteredData);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  console.log({currentData})
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
        <h1 className="text-2xl font-bold text-gray-800">All Store List</h1>
        {!formVisible && (
          <button
            onClick={() => setFormVisible(true)}
            className="px-4 py-2 bg-blue-900 text-white rounded-r hover:bg-blue-600"
          >
            + Add Store
          </button>
        )}
      </div>

      {/* formVisible */}
      {formVisible ? (
        // <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? "Edit Store" : "Add New Store"}
          </h2>
          <form onSubmit={editingId ? handleSaveEdit : handledAddStore}>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="font-medium">Store Name</label>
                <input
                  type="text"
                  name="storeName"
                  placeholder="Enter Store Name"
                  className="border p-2 rounded w-full"
                  value={formData.storeName}
                  onChange={(e) =>
                    setFormData({ ...formData, storeName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Store Owner</label>
                <input
                  type="text"
                  name="storeOwner"
                  className="w-full border border-gray-300 p-2 rounded"
                  value={formData.storeOwner}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      storeOwner: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Contact Number</label>
                <input
                  type="number"
                  name="storeContactNumber"
                  className="w-full border border-gray-300 p-2 rounded"
                  value={formData.storePhone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      storePhone: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Address</label>
                <input
                  type="text"
                  name="storeAddress"
                  className="w-full border border-gray-300 p-2 rounded"
                  value={formData.storeAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, storeAddress: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">City</label>
                <select
                  name="cityId"
                  className="w-full border border-gray-300 p-2 rounded"
                  value={formData.cityId}
                  onChange={(e) => {
                    setFormData({ ...formData, cityId: e.target.value });
                    fetchSubcities(e.target.value);
                  }}
                >
                  <option value="" disabled>
                    Select a city
                  </option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Subcity Dropdown */}
              <div className="mb-4">
                <label className="block mb-2 font-medium">Subcity/Area</label>
                <select
                  name="subCityId"
                  className="w-full border border-gray-300 p-2 rounded"
                  value={formData.subCityId}
                  onChange={(e) =>
                    setFormData({ ...formData, subCityId: e.target.value })
                  }
                  disabled={!formData.cityId} // Disable if no city is selected
                >
                  <option value="" disabled>
                    Select a subcity/area
                  </option>
                  {subcities.map((subcity) => (
                    <option key={subcity.id} value={subcity.id}>
                      {subcity.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium">Google Map URL</label>
                <input
                  type="text"
                  name="mapUrl"
                  className="w-full border border-gray-300 p-2 rounded"
                  value={formData.mapUrl}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mapUrl: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Store Photos</label>
                <input
                  type="file"
                  name="image"
                  className="w-full border border-gray-300 p-2 rounded"
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
        // </div>

        <div className="bg-white p-6 shadow-md rounded-lg">
          {/* Search Bar */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search by Store Name..."
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
                    Store Image
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Store Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Contact Number
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Address
                  </th>
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
                      Loading...{" "}
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No data found
                    </td>
                  </tr>
                ) : (
                  data.map((store) => (
                    <tr
                      key={store.id}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">{store.id}</td>
                      <td className="px-6 py-4">
                        {store.image ? (
                          <img
                            src={store.image}
                            alt="Uploaded Base64"
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          "-"
                        )}
                      </td>

                      <td className="px-6 py-4">{store.name}</td>
                      <td className="px-6 py-4">{store.phone}</td>
                      <td className="px-6 py-4">
                        <a
                          href={store.address}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {store.address}
                        </a>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          className={`px-2 py-1 rounded ${
                            statuses.find((row) => row.id === store.id)
                              ?.status === "Active"
                              ? "bg-green-600 hover:bg-green-600 text-white"
                              : "bg-red-700 hover:bg-red-600 text-white"
                          }`}
                          onClick={() => toggleStatus(store.id)}
                        >
                          {statuses.find((row) => row.id === store.id)
                            ?.status ?? "Active"}
                        </button>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          className="px-4 py-2 flex items-center text-white bg-blue-800 hover:bg-blue-600 rounded mr-2"
                          onClick={() => handleEditStore(store)}
                        >
                          <FaEdit className="mr-2" />
                          Edit
                        </button>
                        <button
                          className="px-4 py-2 text-white bg-red-800 hover:bg-red-600 rounded"
                          onClick={() => setConfirmDeleteId(store.id)}
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
                    onClick={() => handleDeleteStore(confirmDeleteId)}
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

export default StoreMaster;




// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { FaEdit, FaTrash } from "react-icons/fa";

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

// const AllBrands = () => {
//   const [data, setData] = useState([]);
//   console.log({data})
//   // const [statuses, setStatuses] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [formVisible, setFormVisible] = useState(false); // Form state
//   const [editingId, setEditingId] = useState(null);
//   const [confirmDeleteId, setConfirmDeleteId] = useState(null);
//   const [formData, setFormData] = useState({
//     brandName: "",
//     logo: " ",
//   });
//   const [loading, setLoading] = useState(true);
//   const [itemsPerPage] = useState(5);
//   const [totalPages, setTotalPages] = useState(1);

//   //Fetch Brands data
//   useEffect(() => {
//     const fetchBrand = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get("http://localhost:8080/brand/all",{
//           params:{
//             page: currentPage -1,
//             size: itemsPerPage,
//           }
//         });
//         console.log("fetched brand data:", response.data)
//         if (response.data && response.data.content) {
//           setData(response.data.content);
//           setTotalPages(response.data.totalPages);
//         } else {
//           console.error("Invalid response format");
//         }
//       } catch (error) {
//         console.error("Error fetchig brands data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBrand();
//   }, [currentPage,itemsPerPage]);

//   //Add Brands
//   const handledAddBrand = (e) => {
//     e.preventDefault();
//     console.log(formData);
//     axios
//       .post("http://localhost:8080/brand/add", formData)
//       .then((response) => {
//         setData([...data,response.data]);
//         resetForm();
//         setCurrentPage(1);
//         // // Ensure `data` is an array
//         // if (!Array.isArray(data)) {
//         //   console.error("Data is not an array. Resetting to an empty array.");
//         //   setData([response.data]);
//         // } else {
//         //   setData([...data, response.data]);
//         // }
//       })
//       .catch((error) => console.error("Error adding brands data", error));
//   };

//   //Save Edit
//   const handleSaveEditBrand = (e) => {
//     e.preventDefault();
//     axios
//       .put(`http://localhost:8080/api/brands/${editingId}`, formData)
//       .then((response) => {
//         setData(
//           data.map((brand) => brand.id === editingId ? response.data : brand)
//         );
//         resetForm();
//       })
//       .catch((error) => console.error("Error Saving Data:", error));
//   };

//   //Edit form prefille Brand
//   const handleEditBrand = (brand) => {
//     setEditingId(brand.id);
//     setFormData({
//       brandName: brand.brandName,
//       logo: brand.logo,
//     });
//     setFormVisible(true);
//   };

//   // Confirm Deletion
//   const confirmDeleteBrand = (id) => {
//     handleDeleteBrand(id);
//     setConfirmDeleteId(null); // Reset after deletion
//   };

//   //Delete Brand
//   const handleDeleteBrand = (id) => {
//     axios
//       .delete(`http://localhost:8080/api/brands/${id}`)
//       .then(() => {setData(data.filter((brand) => brand.id !== id))})
//       .catch((error) => {console.error("Error deleting data:", error)
//       setConfirmDeleteId(null)});
//   };

//   //Reset Form
//   const resetForm = () => {
//     setEditingId(null);
//     setFormData({
//       brandName: " ",
//       logo: " ",
//     });
//     setFormVisible(false);
//   };

//   // Filtered data based on search query
//   const filteredData = data.filter(
//     (item) => 
//       item.brandName &&
//       item.brandName.toLowerCase().includes(searchQuery.toLowerCase()) // Fix here
//   );

//   // Pagination logic
//   const handleNextPage = () =>{
//     if(currentPage < totalPages){
//       setCurrentPage((prevPage) =>prevPage + 1);
//     }
//   }

//   const handlePrevPage=()=>{
//     if(currentPage > 1){
//       setCurrentPage((prevPage) => prevPage-1)
//   }
// }

//   // // Toggle status function
//   // const toggleStatus = (id) => {
//   //   setStatuses((prevStatuses) =>
//   //     prevStatuses.map((row) =>
//   //       row.id === id
//   //         ? { ...row, status: row.status === "Active" ? "Inactive" : "Active" }
//   //         : row
//   //     )
//   //   );
//   // };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">All Brands</h1>
//         {!formVisible && (
//           <button
//             onClick={() => setFormVisible(true)}
//             className="px-4 py-2 bg-blue-900 text-white rounded-r hover:bg-blue-600"
//           >
//             + Add Brand
//           </button>
//         )}
//       </div>

//       {formVisible ? (
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <h2 className="text-xl font-bold mb-4">
//             {editingId ? "Edit Brand" : "Add New Brand"}
//           </h2>
//           <form onSubmit={editingId ? handleSaveEditBrand : handledAddBrand}>
//             <div className="grid grid-cols-3 gap-4">
//               <div className="col-span-2 sm:col-span-1">
//                 <label className="font-medium">Brand Name</label>
//                 <input
//                   type="text"
//                   name="brandName"
//                   placeholder="Enter Brand Name"
//                   className="border p-2 rounded w-full"
//                   value={formData.brandName}
//                   onChange={(e) =>
//                     setFormData({ ...formData, brandName: e.target.value })
//                   }
//                   required
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block mb-2 font-medium">Image</label>
//                 <input
//                   type="file"
//                   name="logo"
//                   className="w-full border border-gray-300 p-2 rounded"
//                   onChange={async (e) => {
//                     const file = e.target.files[0];
//                     if (file) {
//                       try {
//                         const base64String = await convertImageToBase64(file);
//                         console.log("Base64:", base64String);
//                         setFormData({
//                           ...formData,
//                           logo: base64String,
//                         });
//                       } catch (error) {
//                         console.error("Error converting image:", error);
//                       }
//                     }
//                   }}
//                 />
//                 {formData.logo && (
//                   <div className="mt-2">
//                     <div className="w-[90px] h-[90px] border border-gray-300 rounded flex items-center justify-center overflow-hidden">
//                       <img
//                         src={formData.logo}
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
//         <div className="bg-white p-6 shadow-md rounded-lg">
//           {/* Search Bar */}
//           <div className="flex justify-between items-center mb-4">
//             <div className="flex items-center">
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="border border-gray-300 rounded-l px-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>
//           <div className="relative overflow-x-auto">
//             <table className="w-full text-sm text-left text-gray-500">
//               <thead className="text-xs text-gray-700 uppercase bg-gray-200">
//                 <tr>
//                   <th scope="col" className="px-6 py-3">
//                     ID
//                   </th>
//                   <th scope="col" className="px-6 py-3">
//                     Image
//                   </th>
//                   <th scope="col" className="px-6 py-3">
//                     Brand Name
//                   </th>
//                   {/* <th scope="col" className="px-6 py-3">
//                     Status
//                   </th> */}
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
//                 ) : filteredData.length === 0 ? (
//                   <tr>
//                     <td colSpan="6" className="text-center py-4">
//                       No data found
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredData.slice(0,itemsPerPage).map((brand) => (
//                     <tr
//                       key={brand.id}
//                       className="bg-white border-b hover:bg-gray-50"
//                     >
//                       <td className="px-6 py-3">{brand.id}</td>
//                       <td className="px-6 py-4">
//                         {brand.logo ? (
//                           <img
//                             src={brand.logo}
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

//                       <td className="px-6 py-4">{brand.name}</td>
//                       <td className="px-6 py-4">
//                         <button
//                           className={`px-2 py-1 rounded ${
//                             statuses.find((row) => row.id === brand.id)
//                               ?.status === "Active"
//                               ? "bg-green-600 hover:bg-green-600 text-white"
//                               : "bg-red-700 hover:bg-red-600 text-white"
//                           }`}
//                           onClick={() => toggleStatus(brand.id)}
//                         >
//                           {statuses.find((row) => row.id === brand.id)
//                             ?.status ?? "Active"}
//                         </button>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center space-x-4">
//                           <button
//                             className="px-4 py-2 flex items-center text-white bg-blue-800 hover:bg-blue-600 rounded"
//                             onClick={() => handleEditBrand(brand)}
//                           >
//                             <FaEdit className="mr-2" />
//                             Edit
//                           </button>
//                           <button
//                             className="px-4 py-2 flex items-center text-white bg-red-800 hover:bg-red-600 rounded"
//                             onClick={() => setConfirmDeleteId(brand.id)}
//                           >
//                             <FaTrash />
//                           </button>
//                         </div>
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
//                   Are you sure you want to delete this brand?
//                 </p>
//                 <div className="flex justify-end space-x-4">
//                   <button
//                     className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-700"
//                     onClick={() => handleDeleteBrand(confirmDeleteId)}
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
//           <div className="mt-4 flex justify-center space-x-4">
//             <button
//               disabled={currentPage === 1}
//               onClick={handlePrevPage}
//               className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-600"
//             >
//               Prev
//             </button>
//             <span className="px-4 py-2 text-gray-700">{currentPage}</span>
//             <button
//               disabled={currentPage === totalPages}
//               onClick={handleNextPage}
//               className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-600"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllBrands;



// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import { preview } from "vite";

// const AllCategories = () => {
//   const [data, setData] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   // const [statuses, setStatuses] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [formVisible, setFormVisible] = useState(false); // Form state
//   const [editingId, setEditingId] = useState(null);
//   const [confirmDeleteId, setConfirmDeleteId] = useState(null);
//   const [formData, setFormData] = useState({
//     name: " ",
//   });
//   const [loading, setLoading] = useState(true);
//   const [itemsPerPage] = useState(5);
//   const [totalPages,setTotalPages] = useState(1);

// // Fetch categories data
//   useEffect(() => {
//     const fetchCategory = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get("http://localhost:8080/category/all", {
//           params: {
//             page: currentPage - 1, // Backend expects 0-indexed page
//             size: itemsPerPage,    // Number of items per page
//           },
//         });
//         console.log("Fetched category data:", response.data);
//         if (response.data && response.data.content) {
//           setData(response.data.content);
//           setTotalPages(response.data.totalPages); // Set total pages from response
//         } else {
//           console.error("Invalid response format");
//         }
//       } catch (error) {
//         console.error("Error fetching category data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCategory();
//   }, [currentPage, itemsPerPage]); // Re-fetch when page or itemsPerPage changes



//   //Add Category
//   const handledAddCategory = (e) => {
//     e.preventDefault();
//     // console.log(formData);
//     axios
//       .post("http://localhost:8080/category/add", formData)
//       .then((response) => {
//         setData([...data,response.data])  //add new category to data
//         resetForm(); 
//         //Optionally reload categories after adding
//       })
//       .catch((error) => console.error("Error adding category data", error));
//   };
//   // console.log(data);

//   // Edit Category
//   const handleSaveEditCategory = (e) => {
//     e.preventDefault();
//     axios
//       .put(`http://localhost:8080/category/${editingId}`, formData)
//       .then((response) => {
//         setData(
//           data.map((category) =>
//             category.id === editingId ? response.data : category
//           )
//         );
//         resetForm();
//       })
//       .catch((error) => console.error("Error Saving Data:", error));
//   };

//   //Edit form prefill
//   const handleEditCategory = (category) => {
//     setEditingId(category.id);
//     setFormData({
//       name: category.name,
//     });
//     setFormVisible(true);
//   };

//   //confirm Deletion
//   const confirmDeleteCategory =(id)=>{
//     handleDeleteCategory(id);
//     setConfirmDeleteId(null); //Reset after deletion 
//   }


//   //Delete category
//   const handleDeleteCategory = (id) => {
//     axios
//       .delete(`http://localhost:8080/category/${id}`)
//       .then(() => {
//         // Remove the deleted category from the state
//         setData(data.filter((category) => category.id !== id));
//       })          
//       .catch((error) => {
//         console.error("Error deleting category:", error);
//         setConfirmDeleteId(null); // Close delete confirmation on error
//       });
//   };

//   //Reset Form
//   const resetForm = () => {
//     setEditingId(null);
//     setFormData({
//       name: "",
//     });
//     setFormVisible(false);
//   };

//   // Filtered data based on search query
//   const filterData = data.filter(
//     (item)=>
//       item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Pagination logic
//   const handleNextPage=()=>{
//     if(currentPage < totalPages){
//       setCurrentPage((prevPage) => prevPage + 1);
//     }
//   }

//   const handlePrevPage=()=>{
//     if(currentPage > 1){
//       setCurrentPage((preview) => prevPage - 1);
//     }
//   }

//   // Toggle status function
//   // const toggleStatus = (id) => {
//   //   setStatuses((prevStatuses) =>
//   //     prevStatuses.map((row) =>
//   //       row.id === id
//   //         ? { ...row, status: row.status === "Active" ? "Inactive" : "Active" }
//   //         : row
//   //     )
//   //   );
//   // };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">All Categories</h1>
//         {!formVisible && (
//           <button
//             onClick={() => setFormVisible(true)}
//             className="px-4 py-2 bg-blue-900 text-white rounded-r hover:bg-blue-600"
//           >
//             + Add Category
//           </button>
//         )}
//       </div>

//       {/* Form Section  */}
//       {formVisible ? (
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <h2 className="text-xl font-bold mb-4">
//             {editingId ? "Edit Category" : "Add New Category"}
//           </h2>
//           <form
//             onSubmit={editingId ? handleSaveEditCategory : handledAddCategory}
//           >
//             <div className="grid grid-cols-3 gap-4">
//               <div className="col-span-2 sm:col-span-1">
//                 <label className="font-medium">Category Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   placeholder="Enter category Name"
//                   className="border p-2 rounded w-full"
//                   value={formData.name}
//                   onChange={(e) =>
//                     setFormData({ ...formData, name: e.target.value })
//                   }
//                   required
//                 />
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
//         <div className="bg-white p-6 shadow-md rounded-lg">
//           {/* Search Bar */}
//           <div className="flex justify-between items-center mb-4">
//             <div className="flex items-center">
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="border border-gray-300 rounded-l px-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Table  */}
//           <div className="relative overflow-x-auto">
//             <table className="w-full text-sm text-left text-gray-500">
//               <thead className="text-xs text-gray-700 uppercase bg-gray-200">
//                 <tr>
//                   <th scope="col" className="px-6 py-3">
//                     ID
//                   </th>

//                   <th scope="col" className="px-6 py-3">
//                     Category Name
//                   </th>
//                   {/* <th scope="col" className="px-6 py-3">
//                     Status
//                   </th> */}
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
//                 ) : filterData.length === 0 ? (
//                   <tr>
//                     <td colSpan="6" className="text-center py-4">
//                       No data found
//                     </td>
//                   </tr>
//                 ) : (
//                   filterData.slice(0, itemsPerPage).map((category) => (
//                     <tr
//                       key={category.id}
//                       className="bg-white border-b hover:bg-gray-50"
//                     >
//                       <td className="px-6 py-3">{category.id}</td>
//                       <td className="px-6 py-4">{category.name}</td>
//                       {/* <td className="px-6 py-4">
//                         <button
//                           className={`px-2 py-1 rounded ${
//                             statuses.find((row) => row.id === category.id)
//                               ?.status === "Active"
//                               ? "bg-green-600 hover:bg-green-600 text-white"
//                               : "bg-red-700 hover:bg-red-600 text-white"
//                           }`}
//                           onClick={() => toggleStatus(category.id)}
//                         >
//                           {statuses.find((row) => row.id === category.id)
//                             ?.status ?? "Active"}
//                         </button>
//                       </td> */}
//                       <td className="px-6 py-4">
//                         <div className="flex items-center space-x-4">
//                           <button
//                             className="px-4 py-2 flex items-center text-white bg-blue-800 hover:bg-blue-600 rounded"
//                             onClick={() => handleEditCategory(category)}
//                           >
//                             <FaEdit className="mr-2" />
//                             Edit
//                           </button>
//                           <button
//                             className="px-4 py-2 flex items-center text-white bg-red-800 hover:bg-red-600 rounded"
//                             onClick={() => setConfirmDeleteId(category.id)}
//                           >
//                             <FaTrash />
//                           </button>
//                         </div>
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
//                     onClick={() => handleDeleteCategory(confirmDeleteId)}
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
//           <div className="mt-4 flex justify-center space-x-4">
//             <button
//               disabled={currentPage === 1}
//               onClick={handlePrevPage}
//               className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-600"
//             >
//               Prev
//             </button>
//             <span className="px-4 py-2 text-gray-700">{currentPage}</span>
//             <button
//               disabled={currentPage === totalPages}
//               onClick={handleNextPage}
//               className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-600"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllCategories;

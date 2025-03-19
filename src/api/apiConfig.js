// import axios from "axios";

// const token = localStorage.getItem("token");
// console.log({ token });
// const apiClient = axios.create({
//   baseURL: "http://localhost:8080",
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   },
// });

// export default apiClient;

// import axios from 'axios';

// const apiClient = axios.create({
//   baseURL: 'http://localhost:8080',
// });

// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   console.log("JWT Token", token );

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default apiClient;


import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // Use Vite env variable
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Get token from localStorage
  console.log("JWT Token", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default apiClient;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiConfig";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Both fields are required.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/admin/login', {
        username,
        password,
      });

      localStorage.setItem("token", response.data.token);
      console.log("Token stored:", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Admin Login</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-500 text-center">
          Forgot password? <a href="#" className="text-blue-500 hover:underline">Reset here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiConfig";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!username || !password) {
      setError("Both fields are required.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.post('/admin/login', {
        username,
        password,
      });

      localStorage.setItem("token", response.data.token);
      console.log("Token stored:", response.data.token);
      // Delay navigation slightly to show success animation
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      setError("Invalid username or password");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg transform transition-all duration-500 ease-in-out hover:shadow-xl motion-safe:animate-fadeIn">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6 motion-safe:animate-slideDown">Admin Login</h2>
        {error && (
          <p className="text-red-500 text-sm text-center p-2 rounded-md bg-red-50 motion-safe:animate-bounce">
            {error}
          </p>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="transform transition duration-500 ease-in-out hover:translate-x-1">
            <label className="block text-sm font-medium text-gray-600">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="transform transition duration-500 ease-in-out hover:translate-x-1">
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className={`w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-500 text-center transform transition duration-500 ease-in-out hover:translate-y-1">
          Forgot password? <a href="#" className="text-blue-500 hover:underline hover:text-blue-700 transition-all duration-300">Reset here</a>
        </p>
      </div>
    </div>
  );
};

// Add these custom animations to your tailwind.config.js file
const tailwindConfig = `
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 0.6s ease-out',
        slideDown: 'slideDown 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  variants: {
    extend: {
      animation: ['motion-safe'],
    },
  },
  plugins: [],
}
`;

export default Login;
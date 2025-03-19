import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/"); // Redirect to login page
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 font-bold text-white bg-red-500 rounded-md hover:bg-red-600 transition duration-300"
    >
      Logout
    </button>
  );
};

export default Logout;

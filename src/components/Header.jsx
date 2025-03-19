import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaUser, FaCog, FaSignOutAlt, FaBars } from "react-icons/fa";
import Logout from "../pages/AdminLogout";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex justify-between items-center p-4 bg-blue-900 text-white shadow-md sticky top-0 z-10 h-20">
      <div className="flex items-center">
        <button
          className="md:hidden mr-4 text-xl"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <FaBars />
        </button>
      </div>

      <div className="relative" ref={dropdownRef}>
        <div
          className="flex items-center gap-2 cursor-pointer hover:text-blue-200 transition-colors group"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <span className="hidden md:block font-medium">Admin</span>
          <div className="relative">
            <FaUserCircle className="text-2xl group-hover:text-blue-200" />
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border border-blue-900"></div>
          </div>
        </div>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg overflow-hidden z-50 animate-fadeIn">
            <div className="bg-blue-50 p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-blue-700 text-white p-3 rounded-full">
                  <FaUserCircle className="text-xl" />
                </div>
                <div>
                  <p className="text-gray-800 font-medium">Admin User</p>
                  <p className="text-gray-500 text-sm">admin@example.com</p>
                </div>
              </div>
            </div>

            <ul className="text-gray-700 py-2">
              <li>
                <a
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <FaUser className="text-blue-600" />
                  <span>My Profile</span>
                </a>
              </li>
              <li>
                <a
                  href="/settings"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <FaCog className="text-blue-600" />
                  <span>Account Settings</span>
                </a>
              </li>
              <li className="border-t border-gray-100 mt-2">
                <div className="px-4 py-3">
                  <Logout />
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>

      {showMobileMenu && (
        <div className="absolute top-full left-0 right-0 bg-blue-800 md:hidden z-20">
          <div className="p-4 border-t border-blue-700">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 rounded-full bg-blue-700 text-white placeholder-blue-300 focus:outline-none"
              />
            </div>
            <ul>
              <li className="py-2"><a href="/dashboard" className="block">Dashboard</a></li>
              <li className="py-2"><a href="/profile" className="block">Profile</a></li>
              <li className="py-2"><a href="/settings" className="block">Settings</a></li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

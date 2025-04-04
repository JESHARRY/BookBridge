import React from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaHistory, FaCog, FaSignOutAlt } from "react-icons/fa";

const Sidebar = ({ data }) => {
  return (
    <div className="absolute left-6 top-[12vh] bottom-0 bg-zinc-800 p-6 rounded-lg flex flex-col items-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700 w-[18rem] min-h-[calc(100vh-12vh)]">
      
      {/* Profile Avatar */}
      <img src={data.avatar} className="h-[12vh] rounded-full border-2 border-blue-500 mb-6" />

      {/* Username */}
      <p className="text-2xl text-white font-semibold mb-4">{data.username}</p>

      {/* Email (with tooltip on hover) */}
      <p
        className="text-sm text-gray-400 text-center w-full px-3 overflow-hidden text-ellipsis whitespace-nowrap mb-6"
        title={data.email}
      >
        {data.email}
      </p>

      {/* Navigation Links (Equal Bottom Spacing) */}
      <div className="w-full flex flex-col flex-grow space-y-6">
        <Link
          to="/profile"
          className="text-zinc-100 font-semibold py-3 px-4 text-center hover:bg-zinc-900 rounded transition-all duration-300 flex items-center justify-center"
        >
          <FaHeart className="mr-3" /> Favourites
        </Link>
        <Link
          to="/profile/orderHistory"
          className="text-zinc-100 font-semibold py-3 px-4 text-center hover:bg-zinc-900 rounded transition-all duration-300 flex items-center justify-center"
        >
          <FaHistory className="mr-3" /> Order History
        </Link>
        <Link
          to="/profile/settings"
          className="text-zinc-100 font-semibold py-3 px-4 text-center hover:bg-zinc-900 rounded transition-all duration-300 flex items-center justify-center"
        >
          <FaCog className="mr-3" /> Settings
        </Link>
      </div>

      {/* Logout Button (Perfectly Spaced at Bottom) */}
      <button className="text-red-500 font-semibold py-3 px-4 w-full text-center bg-zinc-900 hover:bg-red-600 rounded transition-all duration-300 flex items-center justify-center shadow-md">
        <FaSignOutAlt className="mr-3" /> Logout
      </button>
    </div>
  );
};

export default Sidebar;

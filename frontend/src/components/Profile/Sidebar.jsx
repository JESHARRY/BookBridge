import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaHistory, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../stores/auth";

const Sidebar = ({ data }) => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    console.log("Current role is:", role);
  }, [role]);

  return (
    <div className="absolute left-6 top-[12vh] bottom-6 w-[18rem] z-10 p-4">
      <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-md w-full h-full flex flex-col items-center transition-all duration-300 group">
        
        {/* Subtle Gradient Glow Ring */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-10 group-hover:opacity-20 transition-all duration-700 pointer-events-none z-[-1]" />

        {/* Avatar */}
        <img
          src={data.avatar}
          alt="avatar"
          className="h-[11vh] rounded-full border border-blue-400 mt-5 shadow-sm"
        />

        {/* User Info */}
        <p className="text-lg text-white font-semibold mt-4">{data.username}</p>
        <p
          className="text-sm text-gray-300 text-center px-3 mt-1 truncate"
          title={data.email}
        >
          {data.email}
        </p>

        {/* Navigation Links */}
        <div className="mt-8 w-full flex flex-col items-center text-white text-sm font-medium space-y-3">
          {role === "admin" ? (
            <>
              <Link to="/profile/" className="hover:text-blue-400 transition duration-300">All Orders</Link>
              <Link to="/profile/add-book" className="hover:text-blue-400 transition duration-300">Add Book</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="flex items-center gap-2 hover:text-blue-400 transition duration-300">
                <FaHeart /> Favourites
              </Link>
              <Link to="/profile/orderHistory" className="flex items-center gap-2 hover:text-blue-400 transition duration-300">
                <FaHistory /> Order History
              </Link>
              <Link to="/profile/settings" className="flex items-center gap-2 hover:text-blue-400 transition duration-300">
                <FaCog /> Settings
              </Link>
            </>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            dispatch(authActions.logout());
            dispatch(authActions.changeRole("user"));
            localStorage.removeItem("id");
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            history("/");
          }}
          className="mt-auto mb-4 text-red-400 hover:text-red-500 transition duration-300 flex items-center gap-2 text-sm font-semibold"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

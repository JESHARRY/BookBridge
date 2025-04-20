import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { FaUserAlt, FaEnvelope, FaMapMarkerAlt, FaEdit } from "react-icons/fa";

const Settings = () => {
  const [value, setValue] = useState({ address: "" });
  const [profileData, setProfileData] = useState();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const change = (e) => {
    const { name, value: inputValue } = e.target;
    setValue((prev) => ({ ...prev, [name]: inputValue }));
    console.log("Updated address:", inputValue);
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/api/v1/get-user-information",
          { headers }
        );
        setProfileData(response.data);
        setValue({ address: response.data.address });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetch();
  }, []);

  const submitAddress = async () => {
    const response = await axios.put(
      "http://localhost:1000/api/v1/update-address",
      value,
      { headers }
    );
    alert(response.data.message);
  };

  return (
    <>
      {!profileData && (
        <div className="w-full h-[100%] flex items-center justify-center">
          <Loader />
        </div>
      )}

      {profileData && (
        <div className="h-[100%] p-4 md:p-8 text-zinc-100">
          <h1 className="text-3xl md:text-5xl font-bold text-yellow-500 mb-10 flex items-center gap-4">
            <FaUserAlt className="text-yellow-400" />
            Account Settings
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Username */}
            <div className="bg-zinc-800 p-5 rounded-xl shadow-md hover:shadow-yellow-300 transition">
              <label className="text-zinc-400 flex items-center gap-2 text-sm mb-2">
                <FaUserAlt /> Username
              </label>
              <p className="p-3 rounded bg-zinc-900 font-semibold border border-zinc-700">
                {profileData.username}
              </p>
            </div>

            {/* Email */}
            <div className="bg-zinc-800 p-5 rounded-xl shadow-md hover:shadow-yellow-300 transition">
              <label className="text-zinc-400 flex items-center gap-2 text-sm mb-2">
                <FaEnvelope /> Email
              </label>
              <p className="p-3 rounded bg-zinc-900 font-semibold border border-zinc-700">
                {profileData.email}
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="mt-10 bg-zinc-800 p-5 rounded-xl shadow-md hover:shadow-yellow-300 transition">
            <label className="text-zinc-400 flex items-center gap-2 text-sm mb-2">
              <FaMapMarkerAlt /> Address
            </label>
            <textarea
              className="p-3 rounded bg-zinc-900 font-semibold border border-zinc-700 w-full resize-none"
              rows="5"
              placeholder="Enter your address"
              name="address"
              value={value.address}
              onChange={change}
            />
            <div className="flex justify-end mt-4">
              <button
                className="bg-yellow-500 text-zinc-900 font-semibold px-5 py-2 rounded-full flex items-center gap-2 hover:bg-yellow-400 transition-all duration-200"
                onClick={submitAddress}
              >
                <FaEdit /> Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;

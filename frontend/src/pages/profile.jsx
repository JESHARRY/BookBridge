import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Profile/Sidebar';
import { Outlet } from 'react-router-dom';
import axios from "axios";
import Loader from '../components/Loader/Loader';

const Profile = () => {
  const [profile, setProfile] = useState(null); // Initialize as null

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/api/v1/get-user-information",
          { headers }
        );
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  return (
    <div className="bg-zinc-900 px-2 md:px-12 flex flex-col md:flex-row min-h-screen py-8 gap-4 text-white overflow-hidden">
      {!profile ? (
        <div className="w-full flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {/* Sidebar Section */}
          <div className="w-full md:w-[250px] min-w-[200px] min-h-[200px] flex-shrink-0 min-h-screen">
            <Sidebar data={profile} />
          </div>

          {/* Main Content Section */}
          <div className="w-full md:flex-1">
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;

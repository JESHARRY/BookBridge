import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {authActions} from "../stores/auth";
import {useDispatch} from "react-redux";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let { email, password } = formData;
    email = email.trim().toLowerCase();
  
    console.log("🔹 Sending login request:", { email, password });
  
    try {
      const response = await fetch("http://localhost:1000/api/v1/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      console.log("🔹 Full API Response:", data); // Debug response structure
  
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
  
      // 🔹 Extract user details correctly
      const userId = data.user?.id; // Ensure correct path
      const userRole = data.user?.role; // If role is missing, this will be undefined
  
      console.log("🔹 Extracted Values - ID:", userId, "Role:", userRole);
  
      // Store values in localStorage
      dispatch(authActions.login());
      dispatch(authActions.changeRole(userRole));
      if (userId) localStorage.setItem("id", userId);
      if (userRole) localStorage.setItem("role", userRole); // This may be undefined
      localStorage.setItem("token", data.token);
  
      alert("✅ Login successful!");
      navigate("/profile");
      //navigate("/");
    } catch (error) {
      console.error("❌ Login error:", error.message);
      setError(error.message);
    }
  };
  
  
  
  
  
  
  
  

  return (
    <div className="min-h-screen flex flex-col bg-zinc-900 px-12">
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-zinc-800 rounded-lg px-8 py-5 w-full md:w-3/6 lg:w-2/6">
          <p className="text-zinc-200 text-xl">Login</p>
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <label htmlFor="email" className="text-zinc-400">Email</label>
              <input 
                type="email" 
                name="email" 
                className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none" 
                placeholder="xyz@example.com" 
                required 
                onChange={handleChange} 
              />
            </div>

            <div className="mt-4">
              <label htmlFor="password" className="text-zinc-400">Password</label>
              <input 
                type="password" 
                name="password" 
                className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none" 
                placeholder="Password" 
                required 
                onChange={handleChange} 
              />
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <div className="mt-6">
              <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
                Login
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-zinc-400">
              Don't have an account? <Link to="/signup" className="text-blue-400">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>

      <footer className="text-center text-zinc-400 bg-zinc-800 w-full py-2 fixed bottom-0 left-0">
        © 2025 Your Company. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;

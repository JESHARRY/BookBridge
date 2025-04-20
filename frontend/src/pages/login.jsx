import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authActions } from "../stores/auth";
import { useDispatch } from "react-redux";
import { FaEnvelope, FaLock } from "react-icons/fa";

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
    <div className="min-h-screen bg-gradient-to-br from-[#1e1e2f] to-[#2c3e50] flex items-center justify-center p-6 relative overflow-hidden">

      {/* Decorative Glass Background */}
      <div className="absolute w-[90%] max-w-3xl h-[90%] rounded-[3rem] bg-gradient-to-r from-blue-400/30 to-purple-500/20 blur-3xl opacity-30 border-2 border-white/10 z-0 shadow-2xl"></div>

      {/* Form Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl w-full max-w-xl p-10 text-white transition-all duration-500">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-200 tracking-wider">
          ✨ Login to Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:border-blue-400 transition duration-300">
            <FaEnvelope className="text-blue-300" />
            <input
              type="email"
              name="email"
              value={formData.email}
              className="w-full bg-transparent placeholder-gray-300 text-white focus:outline-none"
              placeholder="xyz@example.com"
              required
              onChange={handleChange}
            />
          </div>

          {/* Password Input */}
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:border-blue-400 transition duration-300">
            <FaLock className="text-blue-300" />
            <input
              type="password"
              name="password"
              value={formData.password}
              className="w-full bg-transparent placeholder-gray-300 text-white focus:outline-none"
              placeholder="Password"
              required
              onChange={handleChange}
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 rounded-xl font-semibold text-white tracking-wide shadow-md hover:shadow-indigo-400/40 transition-all duration-300 hover:scale-[1.02]"
            >
              🚀 Login
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <div className="mt-4 text-center">
          <p className="text-zinc-300">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Floating Footer */}
      <footer className="text-center text-zinc-400 bg-zinc-800 w-full py-2 fixed bottom-0 left-0">
        © 2025 BookBridge. All rights reserved.
      </footer>

    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Snackbar } from "@mui/material";
import { FaUser, FaEnvelope, FaLock, FaMapMarkerAlt, FaPhone } from "react-icons/fa";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phoneNumber: "",
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber" && (isNaN(value) || value.length > 10)) return;
    setFormData((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword, address, phoneNumber } = formData;

    if (!username || !email || !password || !confirmPassword || !address || !phoneNumber) {
      alert("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:1000/api/v1/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, username, password, phoneNumber, address }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setSnackbarOpen(true);
      setTimeout(() => navigate(`/otp?email=${encodeURIComponent(email)}`), 2500);

    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const iconMap = {
    username: <FaUser className="text-blue-300" />,
    email: <FaEnvelope className="text-blue-300" />,
    password: <FaLock className="text-blue-300" />,
    confirmPassword: <FaLock className="text-blue-300" />,
    address: <FaMapMarkerAlt className="text-blue-300" />,
    phoneNumber: <FaPhone className="text-blue-300" />,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1e2f] to-[#2c3e50] flex items-center justify-center p-6 relative overflow-hidden">

      {/* Decorative Glass Background */}
      <div className="absolute w-[90%] max-w-3xl h-[90%] rounded-[3rem] bg-gradient-to-r from-blue-400/30 to-purple-500/20 blur-3xl opacity-30 border-2 border-white/10 z-0 shadow-2xl"></div>

      {/* Form Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl w-full max-w-xl p-10 text-white transition-all duration-500">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-200 tracking-wider">
           Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {Object.keys(formData).map((key) => (
            <div
              className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:border-blue-400 transition duration-300"
              key={key}
            >
              {iconMap[key]}
              <input
                type={key.includes("password") ? "password" : "text"}
                name={key}
                value={formData[key]}
                className="w-full bg-transparent placeholder-gray-300 text-white focus:outline-none"
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                required
                onChange={handleChange}
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 rounded-xl font-semibold text-white tracking-wide shadow-md hover:shadow-indigo-400/40 transition-all duration-300 hover:scale-[1.02]"
            disabled={emailError}
          >
             Sign Up
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-zinc-300">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:underline">Log In</Link>
          </p>
        </div>
      </div>

      <Snackbar open={snackbarOpen} autoHideDuration={2000} message="An OTP is sent to your email" />
    </div>
  );
};

export default SignUp;

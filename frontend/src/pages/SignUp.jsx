import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Snackbar } from "@mui/material";

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

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber" && (isNaN(value) || value.length > 10)) return;
    setFormData((prevValues) => ({ ...prevValues, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword, address, phoneNumber } = formData;

    // Check for empty fields
    if (!username || !email || !password || !confirmPassword || !address || !phoneNumber) {
      alert("All fields are required!");
      return;
    }

    // Check password confirmation
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

      alert("Signup successful. Please check your email for OTP verification.");
      navigate(`/otp?email=${encodeURIComponent(email)}`);

    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-900 px-12">
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-zinc-800 rounded-lg px-8 py-5 w-full md:w-3/6 lg:w-2/6">
          <p className="text-zinc-200 text-xl">Sign Up</p>
          <form onSubmit={handleSubmit}>
            {Object.keys(formData).map((key) => (
              <div className="mt-4" key={key}>
                <label htmlFor={key} className="text-zinc-400">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  type={key.includes("password") ? "password" : "text"}
                  name={key}
                  value={formData[key]}
                  className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
                  placeholder={key}
                  required
                  onChange={handleChange}
                />
              </div>
            ))}
            <button
              type="submit"
              className="mt-6 w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
              disabled={emailError}
            >
              Sign Up
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-zinc-400">
              Already have an account? <Link to="/login" className="text-blue-400">Log In</Link>
            </p>
          </div>
        </div>
      </div>
      <footer className="text-center text-zinc-400 bg-zinc-800 w-full py-2 fixed bottom-0 left-0">
        © 2025 Your Company. All rights reserved.
      </footer>
      <Snackbar open={snackbarOpen} autoHideDuration={2000} message="An OTP is sent to your email" />
    </div>
  );
};

export default SignUp;

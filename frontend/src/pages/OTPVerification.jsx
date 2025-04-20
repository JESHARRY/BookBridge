import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OTPVerification = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return; // Allow only numbers
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOTP = otp.join("").trim(); // Ensure OTP is string
  
    console.log("Final OTP Sent to Server:", enteredOTP);
  
    if (enteredOTP.length !== 6 || !email) {
      setError("Please enter a valid email and 6-digit OTP");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:1000/api/v1/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: enteredOTP }), // Ensure OTP is sent correctly
      });
  
      const data = await response.json();
      console.log("Server Response:", data);
  
      if (response.ok) {
        alert("OTP Verified Successfully!");
        navigate("/profile");
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Something went wrong. Please try again.");
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1e2f] to-[#2c3e50] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative Glass Background */}
      <div className="absolute w-[90%] max-w-3xl h-[90%] rounded-[3rem] bg-gradient-to-r from-blue-400/30 to-purple-500/20 blur-3xl opacity-30 border-2 border-white/10 z-0 shadow-2xl"></div>

      {/* Form Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl w-full max-w-xl p-10 text-white transition-all duration-500">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-200 tracking-wider">
          ✨ OTP Verification
        </h2>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email Input */}
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:border-blue-400 transition duration-300">
            <input
              type="email"
              name="email"
              value={email}
              className="w-full bg-transparent placeholder-gray-300 text-white focus:outline-none"
              placeholder="xyz@example.com"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* OTP Input */}
          <div className="mt-4">
            <label className="text-zinc-400">Enter OTP</label>
            <div className="flex justify-between mt-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  className="w-12 h-12 bg-zinc-900 text-zinc-100 text-center text-xl outline-none border border-gray-600 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:outline-none hover:border-cyan-400"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 rounded-xl font-semibold text-white tracking-wide shadow-md hover:shadow-indigo-400/40 transition-all duration-300 hover:scale-[1.02]"
            >
              🚀 Verify OTP
            </button>
          </div>
        </form>
        
      </div>

      {/* Floating Footer */}
      <footer className="text-center text-zinc-400 bg-zinc-800 w-full py-2 fixed bottom-0 left-0">
        © 2025 BookBridge. All rights reserved.
      </footer>

    </div>
  );
};

export default OTPVerification;

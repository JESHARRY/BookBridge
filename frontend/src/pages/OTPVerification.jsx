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
        navigate("/");
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Something went wrong. Please try again.");
    }
    
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-zinc-900 px-12">
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-zinc-800 rounded-lg px-8 py-5 w-full md:w-3/6 lg:w-2/6">
          <p className="text-zinc-200 text-xl">Verify OTP</p>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <label htmlFor="email" className="text-zinc-400">Email</label>
              <input 
                type="email" 
                className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
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
                    className="w-12 h-12 bg-zinc-900 text-zinc-100 text-center text-xl outline-none border border-gray-600 rounded-lg"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    aria-label={`OTP digit ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            <div className="mt-6">
              <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">Verify</button>
            </div>
          </form>
        </div>
      </div>
      <footer className="text-center text-zinc-400 bg-zinc-800 w-full py-2 fixed bottom-0 left-0">
        © 2025 Your Company. All rights reserved.
      </footer>
    </div>
  );
};

export default OTPVerification;

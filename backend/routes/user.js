const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuthenticate");
const secretKey = process.env.JWT_SECRET;
const speakeasy = require("speakeasy"); // For OTP generation
const nodemailer = require("nodemailer"); // For email sending
const OTP = require('../models/otp');  // Import your OTP model

// Email OTP sending function
require("dotenv").config();

// ✅ Securely store email & password in .env file
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Email OTP sending function
async function sendOTPEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: "BookBridge - Your OTP Code for Verification", // Updated Subject
    html: `
        <div style="
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 30px; 
            background: white;
            border: 2.5px solid black;
            max-width: 450px;
            margin: auto;
            border-radius: 10px;
            box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
        ">
            <img src="https://cdn-icons-png.flaticon.com/512/726/726623.png" width="80" alt="Email Icon" style="margin-bottom: 10px;">
            <h2 style="color: black; margin-bottom: 10px;">Verify Your Email Address</h2>
            <p style="font-size: 16px; color: black;">
                Enter the following OTP to verify your email:
            </p>

            <div style="
                display: flex; 
                justify-content: center; 
                align-items: center;
                gap: 10px;
                margin: 20px 0;
            ">
                ${otp.split("").map(num => `
                    <div style="
                        width: 45px; 
                        height: 50px;
                        display: flex; 
                        align-items: center; 
                        justify-content: center;
                        font-size: 24px; 
                        font-weight: bold;
                        border: 1.5px solid black; /* ✅ Fixed */
                        border-radius: 5px;
                        background: #f8f8f8;
                        color: black;
                        text-align: center;
                    ">
                        ${num}
                    </div>
                `).join("")}
            </div>

            <a href="https://yourwebsite.com/verify" style="
                text-decoration: none;
                background: orange;
                color: white;
                padding: 12px 20px;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                display: inline-block;
                margin-top: 10px;
            ">Verify Email</a>

            <p style="color: black; margin-top: 10px; font-size: 14px;">
                If you didn’t request this, please ignore this email.
            </p>
        </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}


// Sign Up with OTP
router.post("/sign-up", async (req, res) => {
  try {
    console.log("Received SignUp Request:", req.body); // ✅ Check if request data is received

    const { username, email, password, address, phoneNumber } = req.body;

    if (!username || username.length < 4) {
      return res.status(400).json({ message: "Username must be at least 4 characters long." });
    }

    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({ message: "Invalid phone number." });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashPassword,
      address,
      phoneNumber,
    });

    console.log("Saving user:", newUser); // ✅ Check if user is about to be saved
    await newUser.save();
    console.log("User saved successfully!"); // ✅ Ensure user is saved

    // ✅ Generate OTP
    const otp = speakeasy.totp({ secret: 'base32secret3232', encoding: 'base32' });
    console.log("Generated OTP:", otp); // ✅ Ensure OTP is generated

    // ✅ Set OTP expiration time (5 minutes)
    const otpExpiration = Date.now() + 5 * 60 * 1000;

    // ✅ Save OTP in database
    const send_otp = new OTP({
      email,
      otp,
      createdAt: otpExpiration,
    });

    console.log("Saving OTP:", send_otp); // ✅ Check OTP before saving
    await send_otp.save();
    console.log("OTP saved successfully!"); // ✅ Ensure OTP is saved

    // ✅ Send OTP email
    await sendOTPEmail(email, otp);
    console.log("OTP sent to email:", email); // ✅ Ensure email is sent

    return res.status(200).json({ message: "OTP sent to your email. Please verify it." });
  } catch (error) {
    console.error("Error in SignUp:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// OTP Verification and User Registration
// OTP Verification and User Registration

router.post("/verify-otp", async (req, res) => {
  try {
    console.log("Received OTP Verification Request:", req.body);

    const { email, otp } = req.body;

    if (!email || !otp) {
      console.log("Missing email or OTP");
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    // Fetch the latest OTP record
    const otpRecord = await OTP.findOne({ email, verified: false }).sort({ createdAt: -1 });

    console.log("Stored OTP in DB:", otpRecord?.otp, "Received OTP:", otp);

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP not found. Please request a new one." });
    }

    // Check OTP expiration
    const now = Date.now();
    if (now > new Date(otpRecord.createdAt).getTime() + 300000) {
      console.log("OTP expired");
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Check if OTPs match
    if (otp.trim() !== otpRecord.otp.trim()) {
      console.log("OTP Mismatch");
      return res.status(400).json({ message: "Invalid OTP." });
    }

    console.log("OTP Verified Successfully!");

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    return res.status(200).json({ message: "OTP Verified Successfully!" });

  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


// Sign-In with OTP (For login)
router.post("/sign-in", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User not found. Please sign up first." });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials. Please try again." });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email, role: existingUser.role }, // ✅ Include role in the token
      "$Hari2224@642422", // Change this to a secure secret key in .env
      { expiresIn: "31d" }
    );

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: existingUser._id,
        email: existingUser.email,
        username: existingUser.username,
        role: existingUser.role // ✅ Include role in response
      },
      token
    });

  } catch (error) {
    console.error("❌ Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});





// OTP Verification for Sign-In
router.post("/verify-login-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Fetch the latest OTP for the user
    const otpRecord = await OTP.findOne({ email, verified: false})
      .sort({ createdAt: -1 })
      .lean(); // Convert Mongoose document to plain object

      console.log(otpRecord)

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP not found. Please request a new one." });
    }

    console.log("Stored OTP:", otpRecord.otp);
    console.log("User Input OTP:", otp);

    // Ensure OTP is compared correctly
    if (otp.toString().trim() !== otpRecord.otp.toString().trim()) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await OTP.updateOne({ _id: otpRecord._id }, { $set: { verified: true } });

    return res.status(200).json({ message: "OTP Verified Successfully!" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// gte user information
router.get("/get-user-information",authenticateToken, async (req, res) =>{
  try{
    const {id} = req.headers;
    const data = await User.findById(id);
    return res.status(200).json(data);
  }catch(error){
    res.status(500).json({message:"Internal Server Error."})
  }
});

// update address
router.put("/update-address",authenticateToken, async(req,res) =>{
  try {
    const {id} = req.headers;
    const {address}= req.body;
    await User.findByIdAndUpdate(id, {address:address});
    return res.status(200).json({message:"Address updated successfully,"});
  } catch (error) {
    res.status(500).json({message:"Internal Server Error."});
  }
});

// Route to check if user already exists
router.post("/check-user", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      res.json({ exists: true, message: "User already exists" });
    } else {
      res.json({ exists: false, message: "User does not exist" });
    }
  } catch (error) {
    console.error("Error checking user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});




module.exports = router;

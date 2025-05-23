const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    verified:{
        type:Boolean,
        default:false
    },
    createdAt: {
        type: Date,
    },
},{ timestamps: true });

module.exports = mongoose.model("OTP", otpSchema);

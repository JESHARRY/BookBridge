const mongoose = require("mongoose");

const user = new mongoose.Schema({
        username: {
            type:String,
            required:true,
            unique:true
        },
        phoneNumber: {
            type: String,
            required: [true, "Phone number is required"],
            unique: true,
            match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"]
        },
        
        email: {
            type:String, 
            required:true
        },
        password: {
            type:String, 
            required:true
        },
        address: {
            type:String, 
            required:true
        },
        avatar: {
            type:String, 
            default:"https://cdn-icons-png.flaticon.com/512/6915/6915987.png"
        },
        role: {
            type:String,
            default:"user",
            enum:['user','admin']
        },
        favourites: [{ type: mongoose.Types.ObjectId, ref: "Book" }],
        cart: [{ type: mongoose.Types.ObjectId, ref: "Book" }],
        orders: [{ type: mongoose.Types.ObjectId, ref: "Order" }],
    },
    {timestamps: true}
);

module.exports = mongoose.model("User",user);

const mongoose = require('mongoose');
const order = new mongoose.Schema({
    user: {
        type : mongoose.Types.ObjectId,
        ref : "User",
        required: true,
    },
    book: {
        type: mongoose.Types.ObjectId,
        ref: "Book",
        required: true,

    },
    status: {
        type: String,
        ref: "Order Placed",
        enum: ["Order Placed", "Out for delivery", "Delivered", "Cancelled"]
    },
}, {timestamps:true}
);

module.exports = mongoose.model("Order",order);
const mongoose = require("mongoose");

const book = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
}, { timestamps: true });

// ✅ Register model as "Book" (capitalized singular)
module.exports = mongoose.model("Book", book);

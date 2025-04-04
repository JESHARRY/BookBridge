const express = require("express");
const Review = require("../models/Review"); // ✅ Check this path
const router = express.Router();

// Add a review
router.post("/add-review", async (req, res) => {
  try {
    const { bookId, user, comment, rating } = req.body;
    if (!bookId || !comment || !rating) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newReview = new Review({ bookId, user, comment, rating });
    await newReview.save();
    
    res.status(201).json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get reviews for a book
router.get("/get-reviews-by-book-id/:bookId", async (req, res) => {
  try {
    const reviews = await Review.find({ bookId: req.params.bookId });
    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;

const router = require("express").Router();
const User = require("../models/user");
const Book = require("../models/book");
const { authenticateToken } = require("./userAuthenticate");

//ADD BOOKS
router.post("/add-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    if (!id) {
      return res.status(400).json({ message: "User ID is required in headers." });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "You do not have access to perform admin work." });
    }

    const { url, title, author, price, desc, language, genre } = req.body;
    if (!url || !title || !author || !price || !desc || !language || !genre) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newBook = new Book({
      url,
      title,
      author,
      price,
      desc,
      language,
      genre,  // Include genre field
    });

    await newBook.save();
    res.status(200).json({ message: "Book added successfully." });
  } catch (error) {
    console.error("Error adding book:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
});

//UPDATE BOOKS
router.put("/update-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    
    // Find the book by ID first
    const currentBook = await Book.findById(bookid);
    if (!currentBook) {
      return res.status(404).json({ message: "Book not found." });
    }

    // Create an object to store the updated fields
    const updatedFields = {};

    // Compare each field and store the changes only if the new value is different
    if (req.body.url && req.body.url !== currentBook.url) {
      updatedFields.url = req.body.url;
    }
    if (req.body.title && req.body.title !== currentBook.title) {
      updatedFields.title = req.body.title;
    }
    if (req.body.author && req.body.author !== currentBook.author) {
      updatedFields.author = req.body.author;
    }
    if (req.body.price !== undefined && req.body.price !== currentBook.price) {
      updatedFields.price = req.body.price;
    }
    if (req.body.desc && req.body.desc !== currentBook.desc) {
      updatedFields.desc = req.body.desc;
    }
    if (req.body.language && req.body.language !== currentBook.language) {
      updatedFields.language = req.body.language;
    }

    // If there are any updated fields, proceed with the update
    if (Object.keys(updatedFields).length > 0) {
      await Book.findByIdAndUpdate(bookid, updatedFields);
      return res.status(200).json({
        message: "Book updated successfully.",
        updatedFields: updatedFields
      });
    } else {
      return res.status(400).json({ message: "No changes made." });
    }
  } catch (error) {
    return res.status(500).json({ message: "An error occurred." });
  }
});

//Delete books
router.delete("/delete-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    
    // Find the book by ID first
    const bookToDelete = await Book.findById(bookid);
    if (!bookToDelete) {
      return res.status(404).json({ message: "Book not found." });
    }

    // Delete the book
    await Book.findByIdAndDelete(bookid);

    // Send response with book name in the message
    return res.status(200).json({
      message: `${bookToDelete.title} book is deleted successfully.`
    });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred." });
  }
});

// Get all books
router.get("/get-all-books", async (req, res) => {
  try {
    // Fetch all books and sort them by creation date in descending order
    const allBooks = await Book.find().sort({ createdAt: -1 });

    // Return a success response with the books data
    return res.json({
      status: "Success",
      data: allBooks,
    });
  } catch (error) {
    // Handle errors gracefully and return an error response
    return res.status(500).json({ message: "An error occurred." });
  }
});

//get all recent books
router.get("/get-recent-books", async (req, res) => {
  try {
    // Fetch all books and sort them by creation date in descending order
    const books = await Book.find().sort({ createdAt: -1 }).limit(4);

    // Return a success response with the books data
    return res.json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    // Handle errors gracefully and return an error response
    return res.status(500).json({ message: "An error occurred." });
  }
});

//get books by id
router.get("/get-books-by-id/:id", async (req, res) => {
  try {
    const{ id } = req.params;
    const book = await Book.findById(id);
    return res.json({
      status: "Success",
      data: book,
    });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred." });
  }
});

module.exports = router;

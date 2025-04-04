const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuthenticate");

//add book to the cart
router.put("/add-book-to-cart", authenticateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers; // Extract user ID and book ID from headers

        // Fetch the user data
        const userData = await User.findById(id);

        // Check if the book is already in the cart
        const isBookInCart = userData.cart.includes(bookid);
        if (isBookInCart) {
            return res.status(200).json({ message: "Book is already in the cart." });
        }

        // Add the book to the cart
        await User.findByIdAndUpdate(id, { $push: { cart: bookid } });

        return res.status(200).json({ message: "Book added to the cart." });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

//remove book from cart
router.delete("/remove-book-from-cart", authenticateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers; // Extract user ID and book ID from headers

        // Fetch the user data
        const userData = await User.findById(id);

        // Check if the book is in the cart
        const isBookInCart = userData.cart.includes(bookid);
        if (!isBookInCart) {
            return res.status(404).json({ message: "Book is not in the cart." });
        }

        // Remove the book from the cart
        await User.findByIdAndUpdate(id, { $pull: { cart: bookid } });

        return res.status(200).json({ message: "Book removed from the cart." });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

//get cart of a particular user
router.get("/get-cart", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers; // Extract user ID from headers

        // Fetch the user by ID
        const userData = await User.findById(id).populate("cart"); // Populate cart if it contains references

        if (!userData) {
            return res.status(404).json({ message: "User not found." });
        }

        // Return the cart details
        return res.status(200).json({
            message: "Cart fetched successfully.",
            cart: userData.cart,
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});



module.exports = router;

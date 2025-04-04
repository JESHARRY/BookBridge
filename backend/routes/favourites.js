const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuthenticate");

//add book to favourites
router.put("/add-book-to-favourites",authenticateToken, async(req,res) =>{
    try{
        const {bookid, id} = req.headers;
        const userData = await User.findById(id);
        const isBookFavourite = userData.favourites.includes(bookid);
        if(isBookFavourite){
            return res.status(200).json({message: "Book is already in favourites"});
        }
        await User.findByIdAndUpdate(id, {$push: { favourites: bookid}});
        return res.status(200).json({message:"Book added to favourites."});
    }catch(error){
        return res.status(500).json({message:"Internal Server Error"})
    }
});

router.delete("/remove-book-from-favourites", authenticateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);

        const isBookFavourite = userData.favourites.includes(bookid);
        if (!isBookFavourite) {
            return res.status(404).json({ message: "Book not found in favourites." });
        }

        await User.findByIdAndUpdate(id, { $pull: { favourites: bookid } });
        return res.status(200).json({ message: "Book removed from favourites." });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


//get favourites books of a particular user 
router.get("/get-favourite-books", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers; // Extract user ID from headers
        const userData = await User.findById(id).populate("favourites"); // Populate favourites if it's a reference to another collection

        if (!userData) {
           
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({  status: "Success",favourites: userData.favourites });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/get-books-by-id/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params; // Extract book ID from request parameters
        const book = await Book.findById(id); // Find book by ID

        if (!book) {
            return res.status(404).json({ message: "Book not found." });
        }

        return res.status(200).json({ status: "Success", data: book });
    } catch (error) {
        console.error("Error fetching book by ID:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});




module.exports = router;
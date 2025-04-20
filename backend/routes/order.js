const router = require("express").Router();
const User = require("../models/user");
const Book = require("../models/book");
const Order = require("../models/order"); // ✅ Fixed import
const { authenticateToken } = require("./userAuthenticate");

// ✅ Place Order
router.post("/place-order", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { order } = req.body;

        if (!id) {
            return res.status(400).json({ message: "User ID is required in headers." });
        }
        if (!order || !Array.isArray(order) || order.length === 0) {
            return res.status(400).json({ message: "Order data is required and must be an array." });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        for (const orderData of order) {
            const newOrder = new Order({ user: id, book: orderData._id });
            const orderDataFromDb = await newOrder.save();

            await User.findByIdAndUpdate(id, {
                $push: { orders: orderDataFromDb._id },
            });
        }

        return res.json({ status: "success", message: "Order placed successfully" });
    } catch (error) {
        console.error("Error placing order:", error);
        return res.status(500).json({ message: "An error occurred while placing the order." });
    }
});

// ✅ Get order history of a particular user
router.get("/get-order-history", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;

        if (!id) {
            return res.status(400).json({ message: "User ID missing in headers" });
        }

        const userData = await User.findById(id).populate({
            path: "orders",
            populate: { path: "book" },
        });

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        const orderData = userData.orders.reverse();

        return res.json({
            status: "success",
            data: orderData,
        });
    } catch (error) {
        console.error("Error in get-order-history:", error);
        return res.status(500).json({ message: "An error occurred" });
    }
});


// ✅ Get all orders (admin)
router.get("/get-all-orders", authenticateToken, async (req, res) => {
    try {
        console.log("Getting all orders...");
        const userData = await Order.find()
            .populate({ path: "book" })
            .populate({ path: "user" }) // ✅ Correct ref field
            .sort({ createdAt: -1 });   // ✅ Typo fixed

        console.log("Orders found:", userData.length);
        return res.json({
            status: "success",
            data: userData,
        });
    } catch (error) {
        console.error("Error fetching all orders:", error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

// ✅ Update status (assuming placeholder, currently just fetches all orders again)
router.put("/update-status/:id", authenticateToken, async (req, res) => {
    try {
        const { status } = req.body; // Extract status from request body

        // Check if status is valid
        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        // Find the order by ID and update the status
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id, // Order ID from URL
            { status }, // Update the status field
            { new: true } // Return the updated order
        )
            .populate({ path: "book" })
            .populate({ path: "user" });

        // If order not found
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Return updated order in the response
        return res.json({
            status: "success",
            data: updatedOrder,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});


router.delete('/delete-all-orders', async (req, res) => {
    try {
        await Order.deleteMany({}); // Deletes all orders in the database
        res.status(200).json({ message: 'All orders have been deleted.' });
    } catch (error) {
        console.error("Error deleting orders:", error);
        res.status(500).json({ message: 'Error deleting orders' });
    }
});

module.exports = router;

const router = require("express").Router();
const User = require("../models/user");
const Book = require("../models/book");
const Order = require("../models/order");
const { authenticateToken } = require("./userAuthenticate");

//place order
router.post("/place-order", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { order } = req.body;

        // Validate input
        if (!id) {
            return res.status(400).json({ message: "User ID is required in headers." });
        }
        if (!order || !Array.isArray(order) || order.length === 0) {
            return res.status(400).json({ message: "Order data is required and must be an array." });
        }

        // Check if user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        for (const orderData of order) {
            const newOrder = new Order({ user: id, book: orderData._id });
            const orderDataFromDb = await newOrder.save();

            // Saving Order in user's orders array
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

//get order history of particular user
router.get("/get-order-history",authenticateToken, async (req,res)=> {
    try {
        const {id} = req.headers;
        const userData = await User.findById(id).populate({
            path: "orders",
            populate: {path: "book"},
        });

        const orderData =userData.orders.reverse();
        return res.json({
            status: "success",
            data: orderData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "An error occured"});
    }
});

//get all-orders --admin
router.put("/update-status/:id",authenticateToken, async (req,res)=> {
    try {
        const userData =await order.find()
        .populate({
            path: "book",
        })
        .populate({
            path: "user",
        })
        .sort({ createwdAt: -1});
    return res.json({
        status:"success",
        data: userData,
    });
   }catch (error) {
        console.log(error);
        return res.status(500).json({message: "An error occured"});
    }
});


// update order --admin
router.get("/get-order-history",authenticateToken, async (req,res)=> {
    try {
        const {id} = req.params;
        await order.finfByIdAndUpdate(id, {sataus : req.body.status});
        return res.json({
            status : "success",
            message: "status Updated successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "An error occured"});
    }
});



module.exports = router
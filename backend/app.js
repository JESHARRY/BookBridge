const express = require("express");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();
require("./connectionsS/connection");

const reviewRoutes = require("./routes/reviews");
const Books = require("./routes/book");
const Carts = require("./routes/cart");
const Orders = require("./routes/order");
const Favourites = require("./routes/favourites");
const user = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 5000; // ✅ Added a fallback for PORT

// ✅ Middleware
app.use(express.json()); // Parses JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parses form data (if needed)

// ✅ CORS (Only keeping one instance)
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Your frontend URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // ✅ Allow all methods
    credentials: true, // ✅ Allows cookies/session
  })
);

// ✅ Session Middleware (must be after CORS)
app.use(
  session({
    secret: "$Hari2224@642422", // Replace with a secure key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" }, // ✅ Secure in production
  })
);

// ✅ Routes
app.use("/api/v1", user);
app.use("/api/v1", Books);
app.use("/api/v1", Carts);
app.use("/api/v1", Orders);
app.use("/api/v1", Favourites);
app.use("/api/v1", reviewRoutes);

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

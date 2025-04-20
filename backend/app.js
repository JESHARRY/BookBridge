const express = require("express");
const session = require("express-session");
const cors = require("cors");
const MongoStore = require('connect-mongo');
require("dotenv").config();
require("./connectionsS/connection");

const reviewRoutes = require("./routes/reviews");
const Books = require("./routes/book");
const Carts = require("./routes/cart");
const Orders = require("./routes/order");
const Favourites = require("./routes/favourites");
const user = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS - allow both local & deployed frontend
const allowedOrigins = [
  "http://localhost:5173",
  "https://bookbridge-frontend.onrender.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// ✅ Session Middleware
app.use(
  session({
    secret: "$Hari2224@642422",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.URI, // 🔁 Set this in .env for session storage
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

// ✅ Routes
app.use("/api/v1", user);
app.use("/api/v1", Books);
app.use("/api/v1", Carts);
app.use("/api/v1", Orders);
app.use("/api/v1", Favourites);
app.use("/api/v1", reviewRoutes);

// ✅ Default root route (for Render)
app.get("/", (req, res) => {
  res.send("📚 BookBridge Backend is up and running!");
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});

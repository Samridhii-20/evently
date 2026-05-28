require("dotenv").config();  // Load environment variables
console.log("Loaded MONGO_URI:", process.env.MONGO_URI); // Debugging line

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const AuthRouter = require("./routes/auth");
const EventsRouter = require("./routes/events");
const AdminRouter = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

// Check if MONGO_URI exists
if (!MONGO_URI) {
    console.error("❌ MONGO_URI is not defined in .env file");
    process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(AuthRouter);
app.use('/events', EventsRouter);
app.use('/admin', AdminRouter);

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ MongoDB Error:", err));

// ✅ Test Route to Fix "Cannot GET /"
app.get("/", (req, res) => {
    res.send("🚀 Backend is running successfully!");
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { auth, isOrganizer } = require("../middleware/auth");

const router = express.Router();

// User Registration Route
router.post("/auth/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword, role: "attendee" });
        await user.save();

        res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// User Login Route
router.post("/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.log({err})
        res.status(500).send("Server Error");
    }
});

// Change user role (organizer only)
router.put("/auth/change-role/:userId", auth, isOrganizer, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        
        // Only allow changing role from attendee to organizer
        if (user.role === 'attendee') {
            user.role = 'organizer';
            await user.save();
            return res.json({ msg: "User role updated to organizer", user: { id: user.id, name: user.name, email: user.email, role: user.role } });
        } else {
            return res.status(400).json({ msg: "User is already an organizer" });
        }
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: "User not found" });
        }
        res.status(500).send("Server Error");
    }
});

module.exports = router;
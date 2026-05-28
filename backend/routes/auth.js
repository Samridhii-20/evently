const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { auth, isOrganizer } = require("../middleware/auth");

const router = express.Router();

// User Registration Route
router.post("/auth/register", async (req, res) => {
    try {
        const { name, email, password, role, organizingBody, designation } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ msg: "Please fill in all required fields" });
        }

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        let assignedRole = 'attendee';
        let orgBody = undefined;
        let desig = undefined;

        // Auto Admin Check
        if (email.toLowerCase() === 'e23cseu0561@bennett.edu.in') {
            assignedRole = 'admin';
        } else if (role === 'organizer') {
            if (!email.toLowerCase().endsWith('@bennett.edu.in')) {
                return res.status(400).json({ msg: "Organizers must register with a Bennett email (@bennett.edu.in)" });
            }
            if (!organizingBody || !designation) {
                return res.status(400).json({ msg: "Organizing body and designation are required for organizers" });
            }
            assignedRole = 'pending_organizer';
            orgBody = organizingBody;
            desig = designation;
        }

        user = new User({ 
            name, 
            email: email.toLowerCase(), 
            password: hashedPassword, 
            role: assignedRole,
            organizingBody: orgBody,
            designation: desig
        });
        await user.save();

        res.status(201).json({ msg: assignedRole === 'pending_organizer' ? "Registration successful! Pending admin approval." : "User registered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// User Login Route
router.post("/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Please provide all required fields" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(400).json({ msg: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        // Auto check / upgrade Master Admin
        if (user.email.toLowerCase() === 'e23cseu0561@bennett.edu.in' && user.role !== 'admin') {
            user.role = 'admin';
            await user.save();
        }

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
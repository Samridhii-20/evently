const express = require("express");
const User = require("../models/User");
const { auth, isAdmin } = require("../middleware/auth");

const router = express.Router();

// Get all pending organizers
router.get("/pending-organizers", auth, isAdmin, async (req, res) => {
    try {
        const pendingOrganizers = await User.find({ role: 'pending_organizer' }).select("-password");
        res.json(pendingOrganizers);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// Approve pending organizer
router.post("/approve-organizer/:userId", auth, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        if (user.role !== 'pending_organizer') {
            return res.status(400).json({ msg: "User is not a pending organizer" });
        }

        user.role = 'organizer';
        await user.save();

        res.json({ msg: "Organizer approved successfully", user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: "User not found" });
        }
        res.status(500).send("Server Error");
    }
});

module.exports = router;

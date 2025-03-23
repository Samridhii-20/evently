const express = require("express");
const Event = require("../models/Event");
const { auth, isOrganizer } = require("../middleware/auth");

const router = express.Router();

// Create an event (organizer only)
router.post("/create", auth, isOrganizer, async (req, res) => {
    try {
        const { title, description, date, location } = req.body;

        const event = new Event({ title, description, date, location, organizer: req.user.id });
        await event.save();

        res.status(201).json({ msg: "Event created successfully" });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// Get all events with search filtering
router.get("/", async (req, res) => {
    try {
        const { title, date } = req.query;
        let query = {};
        
        // Add search filters if provided
        if (title) {
            query.title = { $regex: title, $options: 'i' }; // Case-insensitive search
        }
        
        if (date) {
            // Create date range for the specified date (entire day)
            const searchDate = new Date(date);
            const nextDay = new Date(searchDate);
            nextDay.setDate(nextDay.getDate() + 1);
            
            query.date = { $gte: searchDate, $lt: nextDay };
        }
        
        const events = await Event.find(query).populate('organizer', 'name email -_id');
        res.json(events);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// Get a specific event by ID
router.get("/:id", async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('organizer', 'name email -_id');
        
        if (!event) {
            return res.status(404).json({ msg: "Event not found" });
        }
        
        res.json(event);
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: "Event not found" });
        }
        res.status(500).send("Server Error");
    }
});

module.exports = router;
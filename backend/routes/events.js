const express = require("express");
const Event = require("../models/Event");
const { auth, isOrganizer } = require("../middleware/auth");
const upload = require("../middleware/upload");
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Create an event (organizer only)
router.post("/create", auth, isOrganizer, upload, async (req, res) => {
    try {
        const { title, description, date, location, registrationLink, category } = req.body;
        
        if (!title || !description || !date || !location || !category) {
            return res.status(400).json({ msg: "Please provide all required fields" });
        }

        // Handle image upload errors
        if (req.fileValidationError) {
            return res.status(400).json({ msg: req.fileValidationError });
        }

        const imagePath = req.files && req.files.eventImage && req.files.eventImage[0] ? `http://localhost:${process.env.PORT || 5001}/uploads/${req.files.eventImage[0].filename}` : null;

        const event = new Event({ 
            title, 
            description, 
            date: new Date(date), 
            location, 
            registrationLink, 
            category,
            organizer: req.user.id,
            image: imagePath
        });

        const savedEvent = await event.save();
        console.log('Event created:', savedEvent);

        res.status(201).json({ msg: "Event created successfully", event: savedEvent });
    } catch (err) {
        console.error('Error creating event:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: err.message });
        }
        if (err.name === 'MulterError') {
            return res.status(400).json({ msg: `Image upload error: ${err.message}` });
        }
        res.status(500).json({ msg: "Server Error", error: err.message });
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

// Update an event (organizer only)
router.put("/:id", auth, isOrganizer, upload, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            return res.status(404).json({ msg: "Event not found" });
        }

        // Check if the organizer owns this event
        if (event.organizer.toString() !== req.user.id) {
            return res.status(401).json({ msg: "Not authorized to update this event" });
        }

        const { title, description, date, location, registrationLink, category } = req.body;
        
        // Handle image upload
        let imagePath = event.image;
        if (req.files && req.files.eventImage && req.files.eventImage[0]) {
            // Delete old image if it exists
            if (event.image) {
                const oldImagePath = path.join(__dirname, '..', event.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            imagePath = `http://localhost:${process.env.PORT || 5001}/uploads/${req.files.eventImage[0].filename}`;
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            {
                title: title || event.title,
                description: description || event.description,
                date: date ? new Date(date) : event.date,
                location: location || event.location,
                registrationLink: registrationLink || event.registrationLink,
                category: category || event.category,
                image: imagePath
            },
            { new: true }
        ).populate('organizer', 'name email -_id');

        res.json(updatedEvent);
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: "Event not found" });
        }
        res.status(500).send("Server Error");
    }
});

// Delete an event (organizer only)
router.delete("/:id", auth, isOrganizer, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            return res.status(404).json({ msg: "Event not found" });
        }

        // Check if the organizer owns this event
        if (event.organizer.toString() !== req.user.id) {
            return res.status(401).json({ msg: "Not authorized to delete this event" });
        }

        // Delete associated image if it exists
        if (event.image) {
            const imagePath = path.join(__dirname, '..', event.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await event.remove();
        res.json({ msg: "Event removed" });
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: "Event not found" });
        }
        res.status(500).send("Server Error");
    }
});

module.exports = router;
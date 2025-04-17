const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    category: { type: String, enum: ['Academic', 'Tech and Innovation', 'Cultural & Entertainment', 'Festival', 'Sports'], required: true },
    registrationLink: { type: String },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    image: { type: String }
});

module.exports = mongoose.model("Event", EventSchema);
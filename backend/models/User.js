const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['attendee', 'pending_organizer', 'organizer', 'admin'], default: 'attendee' },
    organizingBody: { type: String },
    designation: { type: String },
});

module.exports = mongoose.model("User", UserSchema);
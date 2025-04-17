const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
exports.auth = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ msg: 'Invalid authorization header format' });
        }
        const token = authHeader.replace('Bearer ', '');

        // Check if no token
        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user from payload
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return res.status(401).json({ msg: 'Token is not valid' });
        }
        
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Middleware to check if user is an organizer
exports.isOrganizer = (req, res, next) => {
    if (req.user && req.user.role === 'organizer') {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied. Only organizers can perform this action' });
    }
};
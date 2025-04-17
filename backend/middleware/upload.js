const multer = require('multer');
const path = require('path');

// Ensure uploads directory exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for storing uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // Create unique filename with original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        req.fileValidationError = 'Only image files (jpg, jpeg, png, gif) are allowed!';
        return cb(null, false);
    }
    if (!file.mimetype.startsWith('image/')) {
        req.fileValidationError = 'Invalid file type. Please upload only images.';
        return cb(null, false);
    }
    cb(null, true);
};

// Configure upload middleware
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
}).fields([
    { name: 'eventImage', maxCount: 1 }
]);

module.exports = upload;
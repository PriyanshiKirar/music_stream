const express = require('express');
const router = express.Router();
const { uploadTrack } = require('../controllers/music.controller.js');
const authMiddleware = require('../middleware/auth.js');
const artistCheckMiddleware = require('../middleware/artistCheck.js');
const multer = require('multer');

// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/tracks'); // Folder to save the tracks
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Route to upload a track (only accessible to artists)
router.post('/upload', authMiddleware, artistCheckMiddleware, upload.single('track'), uploadTrack);
router.get('/upload', authMiddleware, artistCheckMiddleware, (req, res) => {
    res.render('upload');
});



module.exports = router;
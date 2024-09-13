const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, addToFavorites, createPlaylist } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.js');

// Register a new user

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', registerUser);

// User login
router.get('/login', (req, res) => {
    res.render('login');
});
router.post('/login', loginUser);

// Get user profile (protected route)
router.get('/profile', authMiddleware, getUserProfile);

// Add track to favorites (protected route)
router.get('/:trackId/favorite', authMiddleware, addToFavorites);

// Create playlist (protected route)
router.post('/playlist/create', authMiddleware, createPlaylist);

module.exports = router;

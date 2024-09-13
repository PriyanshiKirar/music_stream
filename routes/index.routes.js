const express = require('express');
const router = express.Router();
const { getHomePage, getTrackById } = require('../controllers/index.controller.js');
const authMiddleware = require('../middleware/auth');

// Home page route
router.get('/', authMiddleware, getHomePage);

// Track by ID route (requires authentication)
router.get('/track/:id', authMiddleware, getTrackById);

module.exports = router
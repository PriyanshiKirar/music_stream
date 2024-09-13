const Track = require('../models/track..model');
const User = require('../models/user');

exports.getHomePage = async (req, res) => {
    try {
        // Fetch recent tracks
        const recentTracks = await Track.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('artist');


        res.render('home', {
            recentTracks,
            user: req.user // Assuming you're using authentication middleware that adds user to req
        });
    } catch (error) {
        console.error('Error in getHomePage:', error);
        res.status(500).render('error', { message: 'Error loading home page' });
    }
};

exports.getTrackById = async (req, res) => {
    try {
        const trackId = req.params.id;
        const track = await Track.findById(trackId).populate('artist');

        if (!track) {
            return res.status(404).render('error', { message: 'Track not found' });
        }
        res.render('track', { track, user: req.user });
    } catch (error) {
        console.error('Error in getTrackById:', error);
        res.status(500).render('error', { message: 'Error loading track' });
    }
};
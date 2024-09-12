const Track = require('../models/track..model'); // Assuming you have a Track model

// Controller to handle track upload
exports.uploadTrack = async (req, res) => {
    try {
        const { title, year, album, duration } = req.body;
        const artist = req.user.username; // Assuming the artist is the logged-in user
        const trackUrl = req.file.path; // Path of the uploaded track

        // Create a new track document in the database
        const newTrack = new Track({
            title,
            artist: req.user._id, // Assuming the artist is the logged-in user
            year,
            duration,
            album,
            url: trackUrl,
            poster: req.body.poster || null // Poster can be optional
        });

        await newTrack.save();

        res.status(201).json({ message: 'Track uploaded successfully', track: newTrack });
    } catch (error) {

        console.log(error);

        res.status(500).json({ error: 'Error uploading track' });
    }
};

// Controller to get all tracks
exports.getAllTracks = async (req, res) => {
    try {
        const tracks = await Track.find(); // Retrieve all tracks from the database
        res.status(200).json({ tracks });
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving tracks' });
    }
};

// Controller to get a single track by ID
exports.getTrackById = async (req, res) => {
    try {
        const track = await Track.findById(req.params.id);

        if (!track) {
            return res.status(404).json({ error: 'Track not found' });
        }

        res.status(200).json({ track });
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving track' });
    }
};

// Controller to update a track by ID
exports.updateTrack = async (req, res) => {
    const { title, year, album, duration } = req.body;

    try {
        const track = await Track.findById(req.params.id);

        if (!track) {
            return res.status(404).json({ error: 'Track not found' });
        }

        // Only the artist who uploaded the track can update it
        if (track.artist !== req.user.username) {
            return res.status(403).json({ error: 'You can only update your own tracks' });
        }

        // Update track details
        track.title = title || track.title;
        track.year = year || track.year;
        track.album = album || track.album;
        track.duration = duration || track.duration;

        await track.save();

        res.status(200).json({ message: 'Track updated successfully', track });
    } catch (error) {
        res.status(500).json({ error: 'Error updating track' });
    }
};

// Controller to delete a track by ID
exports.deleteTrack = async (req, res) => {
    try {
        const track = await Track.findById(req.params.id);

        if (!track) {
            return res.status(404).json({ error: 'Track not found' });
        }

        // Only the artist who uploaded the track can delete it
        if (track.artist !== req.user.username) {
            return res.status(403).json({ error: 'You can only delete your own tracks' });
        }

        await track.remove();

        res.status(200).json({ message: 'Track deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting track' });
    }
};
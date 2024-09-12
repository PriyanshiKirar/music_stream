const artistCheckMiddleware = (req, res, next) => {
    try {
        // Check if the user is an artist

        if (req.user && req.user.isArtist) {
            next(); // User is an artist, allow the action to proceed
        } else {
            return res.status(403).json({ error: 'Access denied. Only artists are allowed to perform this action.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error while checking artist status.' });
    }
};

module.exports = artistCheckMiddleware;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js'); // Assuming the User schema is in models folder
const Track = require('../models/track..model.js');
const Playlist = require('../models/playlist.js');

// Controller function for user registration
exports.registerUser = async (req, res) => {
    const { username, password, email } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser._id, username: newUser.username },
            process.env.JWT_SECRET, // Replace with your secret key
            { expiresIn: '1h' }
        );

        // Set JWT as a cookie
        res.cookie('token', token, {
            httpOnly: true,  // This flag ensures the cookie is sent only over HTTP(S) and isn't accessible via JavaScript
            maxAge: 3600000,  // Token valid for 1 hour
        });

        // Redirect to profile (assuming the profile URL is '/profile')
        res.redirect('/user/profile');
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Controller function for user login
exports.loginUser = async (req, res) => {

    console.log(req.body);

    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET, // Replace with your secret key
            { expiresIn: '1h' }
        );


        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000, // 1 hour
        });

        res.redirect('/user/profile');
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Controller function for getting user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate({
                path: 'favorites',
                model: Track,
                populate: {
                    path: 'artist',
                    model: User,
                    select: 'username'
                }
            })
            .populate('playlists');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.render('profile', { user: user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Controller function to add track to favorites
exports.addToFavorites = async (req, res) => {
    try {
        const trackId = req.params.trackId;
        const userId = req.user.id; // Assuming authMiddleware adds user to req

        // Check if the track exists
        const track = await Track.findById(trackId);
        if (!track) {
            return res.status(404).json({ message: 'Track not found' });
        }

        // Add the track to user's favorites if not already present
        const user = await User.findById(userId);
        if (!user.favorites.includes(trackId)) {
            user.favorites.push(trackId);
            await user.save();
        }
        res.redirect(`/track/${trackId}`);
    } catch (error) {
        console.error('Error adding track to favorites:', error);
        res.status(500).json({ message: 'Error adding track to favorites' });
    }
};

// Controller function to create playlists
exports.createPlaylist = async (req, res) => {
    try {
        const { playlistName } = req.body;
        const userId = req.user._id;

        const newPlaylist = new Playlist({
            title: playlistName,
            user: userId,
            tracks: []
        });

        await newPlaylist.save();

        await User.findByIdAndUpdate(userId, { $push: { playlists: newPlaylist._id } });

        res.redirect('/user/profile');
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};
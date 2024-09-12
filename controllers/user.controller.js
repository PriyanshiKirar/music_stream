const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Assuming the User schema is in models folder

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
        const user = await User.findById(req.user._id).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {

        console.log(error);

        res.status(500).json({ error: 'Server error' });
    }
};
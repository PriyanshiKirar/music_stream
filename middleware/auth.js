const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const authMiddleware = async (req, res, next) => {
    // Get the token from cookies
    const token = req.cookies.token;

    // Check if token is present
    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret key

        const user = await userModel.findOne({ _id: decoded.userId });

        // Attach the decoded user info to the request object
        req.user = user;

        // Proceed to the next middleware
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;
'use strict';

const jwt = require('jsonwebtoken');

// Middleware that protects the API routes by checking the user's JWT token.
// Verifies that the token exists and is valid, and then associates the user's ID with the request.
// If the token is missing or invalid, a 401 error message is sent.
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization token is required' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Invalid authorization format' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

module.exports = authenticateToken;
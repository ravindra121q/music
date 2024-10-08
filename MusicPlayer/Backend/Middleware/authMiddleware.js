const express = require('express');
const jwt = require('jsonwebtoken');
const authRouter = express.Router();

exports.authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
   
    if (!token) {
        return res.status(401).json({ message: 'Token is missing from the authorization header' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        if (decoded) {
            next();
        } else {
            return res.status(401).json({ message: 'Invalid token' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

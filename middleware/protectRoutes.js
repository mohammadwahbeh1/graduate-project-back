
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../utils/jwt');

const User = require('../models/User');

const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Access denied' });
    }

    try {
        const decoded = verifyToken(token);
        const user = await User.findByPk(decoded.id); // Check if user still exists

        if (!user) {
            return res.status(401).json({ status: 'error', message: 'User not found' });
        }
        req.user = { id: user.user_id, role: user.role };


        next();
    } catch (err) {
        res.status(400).json({ status: 'error', message: 'Invalid token' });
    }
};

module.exports = authenticate;

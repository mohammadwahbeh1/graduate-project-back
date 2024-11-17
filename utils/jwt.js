
const jwt = require('jsonwebtoken');

const secret = 'Mo@Ab!@#123'; 

const generateToken = (user) => {
    return jwt.sign({ id: user.user_id, role: user.role }, secret, { expiresIn: '10h' });
};

const verifyToken = (token) => {
    return jwt.verify(token, secret);
};

module.exports = { generateToken, verifyToken };

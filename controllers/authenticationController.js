
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');
module.exports.register = async (req, res) => {
    try {
        const { username, email, password, phone_number, role } = req.body;

        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await User.create({ 
            username, 
            email, 
            password_hash: hashedPassword, 
            phone_number, 
            role 
        });
        
        const token = generateToken(newUser);

        res.status(201).json({ status: 'success', data: { user: newUser, token } });
    } catch (err) {
        res.status(400).json({ status: 'error', message: err.message });
    }
};

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        //const hashedPassword = await bcrypt.hash(password_hash, 10);

        if (!user || !(await user.validPassword(password))) {
            return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
        }

        const token = generateToken(user);
        res.status(200).json({ status: 'success', data: { user, token } });
     
    } catch (err) {
        res.status(400).json({ status: 'error', message: err.message });
    }
};

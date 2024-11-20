const User = require('../models/User');

module.exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: users
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

module.exports.getAuser = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                user_id: req.user.id,
            }
        });
        res.status(200).json({
            status: 'success',
        
            data: user
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

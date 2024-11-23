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

module.exports.updateProfile = async (req, res) => {
try {
    const { username, email, phone_number, date_of_birth, gender, address } = req.body;
    console.log('Updating profile with data:', req.body);
    const user = await User.update({
        username: username,
        email: email,
        phone_number: phone_number,
        date_of_birth: date_of_birth,
        gender: gender,
        address: address

    },
    {
        where:{
            user_id: req.user.id,
        },
        

    })
    res.status(200).json({
        status:'success',
        message: 'Profile updated successfully'
    })
    
} catch (error) {
    res.status(400).json({
        status: 'fail to update profile',
        message: error.message
    })
    
}


}

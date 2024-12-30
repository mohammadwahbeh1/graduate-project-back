const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken'); // Import JWT library

const EMAIL_USERNAME = 'naqalati42@gmail.com';


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


exports.updateUserRole = async (req, res) => {
    try {
        const { userId, newRole } = req.body;

        const validRoles = ['user', 'driver', 'line_manager', 'admin'];
        if (!validRoles.includes(newRole)) {
            return res.status(400).json({ message: 'Invalid role provided.' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.role = newRole;
        await user.save();

        return res.status(200).json({ message: 'User role updated successfully.', user });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'An error occurred while updating the user role.' });
    }
};





module.exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User with this email does not exist'
            });
        }

        // Generate a random 6-digit code
        const code = crypto.randomInt(100000, 999999).toString();

        // Set expiration time for the code (e.g., 10 minutes from now)
        const codeExpiry = new Date();
        codeExpiry.setMinutes(codeExpiry.getMinutes() + 10);

        // Store the code and expiration time in the database
        await User.update({
            reset_code: code,
            reset_code_expiry: codeExpiry
        }, {
            where: { email }
        });

        // Send the code to the user's email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: EMAIL_USERNAME,
                pass: 'fdvdktevpspfargz'
            }
        });

        const emailTemplate = `
            <p>Your password reset code is: ${code}</p>
            <p>This code will expire in 10 minutes.</p>
        `;

        await transporter.sendMail({
            from: EMAIL_USERNAME,
            to: email,
            subject: 'Password Reset Code',
            html: emailTemplate,
        });

        res.status(200).json({
            status: 'success',
            message: 'Verification code sent to your email'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

module.exports.verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        // Find the user with the provided email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User with this email does not exist'
            });
        }

        // Check if the code matches and is not expired
        if (user.reset_code !== code || new Date() > new Date(user.reset_code_expiry)) {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid or expired code'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Code verified successfully. You can now reset your password.'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to verify code'
        });
    }
};

module.exports.resetPassword = async (req, res) => {
    console.log('iam in reset password');
    try {
        const { email, newPassword } = req.body;

        // Add logging to verify the received data
        console.log('Email:', email);
        console.log('New Password:', newPassword);

        // Check if the password is valid
        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({
                status: 'fail',
                message: 'Password must be at least 8 characters long'
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 7);

        const result = await User.update(
            {
                password_hash: hashedPassword,
                reset_code: null,
                reset_code_expiry: null
            },
            {
                where: { email }
            }
        );
        
        console.log('Update result:', result);
        
        if (result[0] === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found or password not updated'
            });
        }
        

        res.status(200).json({
            status: 'success',
            message: 'Password successfully reset'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to reset password'
        });
    }
};



const User = require('../models/User');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');
module.exports.register = async (req, res) => {
    try {
        const { 
            username, 
            email, 
            password, 
            phone_number, 
            role, 
            date_of_birth, 
            gender, 
            address,
            license_number,
            line_id 
        } = req.body;

        console.log('Registering user with data:', req.body);

        // Basic validation for required fields
        if (!username || !email || !password || !phone_number || !role || !date_of_birth || !gender || !address) {
            return res.status(400).json({ status: 'error', message: 'All fields are required.' });
        }

        // Role-specific validation
        if (role === 'driver' && !license_number) {
            return res.status(400).json({ status: 'error', message: 'License number is required for drivers.' });
        }

        if (role === 'line manager' && !line_id) {
            return res.status(400).json({ status: 'error', message: 'Line ID is required for line managers.' });
        }

        const hashedPassword = await bcrypt.hash(password, 7);

        // Create user with conditional fields
        const userData = {
            username,
            email,
            password_hash: hashedPassword,
            phone_number,
            role,
            date_of_birth,
            gender,
            address
        };
        console.log(line_id, userData.role);

        

        const newUser = await User.create(userData);

        const token = generateToken(newUser);

        // Return response with role-specific data
        const responseData = {
            username: newUser.username,
            email: newUser.email,
            phone_number: newUser.phone_number,
            role: newUser.role,
            date_of_birth: newUser.date_of_birth,
            gender: newUser.gender,
            address: newUser.address
        };

    

        res.status(201).json({
            status: 'success',
            data: {
                user: responseData,
                token
            }
        });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(400).json({ status: 'error', message: err.message });
    }
};



module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        const user = await User.findOne({ where: { email } },
            
        );
        console.log(user);
      
        //const hashedPassword = await bcrypt.hash(password_hash, 10);

        if (!user || !(await user.validPassword(password))) {
            console.log("error: invalid password");

            return res.status(401).json({ status: 'error', message: 'Invalid email or password' });

        }

        const token = generateToken(user);
        res.status(200).json({ status: 'success', data: { user, token } });
     
    } catch (err) {
        res.status(400).json({ status: 'error', message: err.message });
    }
};


const User = require('../models/User');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');
module.exports.register = async (req, res) => {
    try {
        const { username, email, password, phone_number, role, date_of_birth, gender, address } = req.body;
        console.log('Registering user with data:', req.body);

        
        if (!username || !email || !password || !phone_number || !role || !date_of_birth || !gender || !address) {
            return res.status(400).json({ status: 'error', message: 'All fields are required.' });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

        
        const newUser = await User.create({ 
            username, 
            email, 
            password_hash: hashedPassword, 
            phone_number, 
            role,
            date_of_birth,  
            gender,          
            address          
        });

        // Generate a token for the new user
        const token = generateToken(newUser);

        // Send the response with user data and token
        res.status(201).json({
            status: 'success', 
            data: { 
                user: {
                    username: newUser.username,
                    email: newUser.email,
                    phone_number: newUser.phone_number,
                    role: newUser.role,
                    date_of_birth: newUser.date_of_birth,  // Include date of birth
                    gender: newUser.gender,                // Include gender
                    address: newUser.address               // Include address
                },
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
            return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
        }

        const token = generateToken(user);
        res.status(200).json({ status: 'success', data: { user, token } });
     
    } catch (err) {
        res.status(400).json({ status: 'error', message: err.message });
    }
};

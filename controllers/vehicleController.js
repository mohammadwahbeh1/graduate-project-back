const Vehicle = require('../models/Vehicle');
const Line = require('../models/Line');
const User = require('../models/User');


 module.exports.createVehicle = async (req, res) => {
    try {
        const {
            driver_id,
            line_id,
            line_manager_id,
            current_status = 'in_terminal',
            current_location = null
        } = req.body;

        // Validate input
        if (!driver_id || !line_id) {
            return res.status(400).json({ error: 'Driver ID and Line ID are required.' });
        }

        // Check if driver exists
        const driver = await User.findByPk(driver_id);
        if (!driver) {
            return res.status(404).json({ error: 'Driver not found.' });
        }

        // Check if line exists
        const line = await Line.findByPk(line_id);
        if (!line) {
            return res.status(404).json({ error: 'Line not found.' });
        }

        // Optionally validate line_manager_id
        if (line_manager_id) {
            const lineManager = await User.findByPk(line_manager_id);
            if (!lineManager) {
                return res.status(404).json({ error: 'Line Manager not found.' });
            }
        }

        // Create the vehicle
        const vehicle = await Vehicle.create({
            driver_id,
            line_id,
            line_manager_id,
            current_status,
            current_location,
        });

        res.status(201).json({
            success: true,
            message: 'Vehicle created successfully.',
            data: vehicle,
        });
    } catch (error) {
        console.error('Error creating vehicle:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

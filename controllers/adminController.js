// controllers/adminController.js
const User = require('../models/User'); 
const Terminal = require('../models/Terminal');
const Vehicle = require('../models/Vehicle');

const Line = require('../models/Line');

module.exports.getAllDrivers = async (req, res) => {
    try {
        const drivers = await User.findAll({ where: { role: 'driver' } });
        res.status(200).json({
            status: 'success',
            data: drivers
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: `Error fetching drivers: ${error.message}`
        });
    }
};

module.exports.getAllLineManagers = async (req, res) => {
    try {
        const lineManagers = await User.findAll({ where: { role: 'line_manager' } });

        res.status(200).json({
            status: 'success',
            data: lineManagers
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: `Error fetching line managers: ${error.message}`
        });
    }
};


module.exports.getAllTerminals = async (req, res) => {
    try {
        const terminals = await Terminal.findAll();
        res.status(200).json({
            status: 'success',
            data: terminals
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: `Error fetching terminals: ${error.message}`
        });
    }
};

module.exports.getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.findAll();
        res.status(200).json({
            status: 'success',
            data: vehicles
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: `Error fetching vehicles: ${error.message}`
        });
    }
}
module.exports.updateAUser= async (req, res) => {

    try {
        const updateAuser = await User.update({
         
            role: req.body.role
        }, {
            where: {
                user_id: req.params.id
            }
        });
        res.status(200).json({
            status:'success',
            message: 'User updated successfully'
        });
    
    }
    catch (error) {
        res.status(400).json({
            status: 'error',
            message: `Error updating user: ${error.message}`
        });
    }

}



module.exports.updateLine = async (req, res) => {
    try {
        const { id } = req.params;
        const { terminal_id, line_manger_id } = req.body; // Adjust fields as needed

        const [updated] = await Line.update(
            { terminal_id, line_manger_id },
            { where: { line_id: id } }
        );

        if (!updated) {
            return res.status(404).json({ status: 'error', message: 'Line not found' });
        }

        const updatedLine = await Line.findOne({ where: { line_id: id } });
        res.status(200).json({
            status: 'success',
            data: updatedLine
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: `Error updating line: ${error.message}`
        });
    }
};





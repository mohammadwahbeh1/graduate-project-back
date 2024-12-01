//lineController.js
const Line=require('../models/Line');
const Vehicle = require('../models/Vehicle');
const { Op } = require('sequelize');
const  Terminal= require("../models/Terminal")



const User = require('../models/User');
const  sequelize  = require('../db')


module.exports.getLineManagerByDriver = async (req, res) => {
    try {
        const driverId  = req.user.id;


        const vehicle = await Vehicle.findOne({
            where: { driver_id: driverId },
            include: [
                {
                    model: Line,
                    as: 'line',
                    include: [
                        {
                            model: User,
                            as: 'lineManager',
                            attributes: ['user_id', 'username', 'phone_number']
                        }
                    ]
                }
            ]
        });

        if (!vehicle || !vehicle.line) {
            return res.status(404).json({ error: 'Driver or Line not found' });
        }

        const lineManager = vehicle.line.lineManager;
        if (!lineManager) {
            return res.status(404).json({ error: 'Line Manager not found' });
        }

        res.json({
            lineManager: {
                id: lineManager.user_id,
                name: lineManager.username,
                email: lineManager.email,
                phone: lineManager.phone_number
            }
        });
    } catch (error) {
        console.error('Error fetching line manager:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




module.exports.getLineLocation = async(req, res)=>{
    try {
        const { lineName } = req.query; 

        if (!lineName) {
            return res.status(400).json({ error: 'Line name is required' });
        }

        
        const line = await Line.findOne({
            where: { line_name: lineName }, 
            attributes: ['lat', 'long'],
        });

        if (!line) {
            return res.status(404).json({ error: 'Line not found' });
        }

       
        return res.status(200).json({
            lineName,
            latitude: line.lat,
            longitude: line.long,
        });
    } catch (error) {
        console.error('Error fetching line location:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports.getDriversByLineManager = async (req, res) => {
    const lineManagerId = req.user.id;

    try {
        // Fetch vehicles that are managed by the specified line_manager
        const vehicles = await Vehicle.findAll({
            where: {
                line_manager_id: lineManagerId
            },
            include: [{
                model: User,
                as: 'driver', // Use the 'driver' alias defined earlier
                attributes: ['user_id', 'username',  'phone_number']
            }]
        });

        // Collect drivers from the vehicles
        const drivers = vehicles.map(vehicle => vehicle.driver);

        if (drivers.length === 0) {
            return res.status(404).json({ error: 'No drivers found for this line manager' });
        }

        res.json({ drivers });
    } catch (error) {
        console.error('Error fetching drivers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.getLinesByTerminalManager = async (req, res) => {
    try {
        const managerId = req.user.id; // Correctly assign managerId


        const terminal = await Terminal.findOne({
            where: { user_id: managerId }, // Fetch terminal by user_id
        });

        if (!terminal) {
            return res.status(404).json({
                success: false,
                message: 'No terminal found for this manager.',
            });
        }

        const lines = await Line.findAll({
            where: { terminal_id: terminal.terminal_id },

            attributes: ['line_id', 'line_name', 'current_vehicles_count' ,'line_manager_id'],
        });

        if (!lines.length) {
            return res.status(404).json({
                success: false,
                message: 'No lines found for this terminal.',
            });
        }

        res.status(200).json({
            success: true,
            terminal_id: terminal.terminal_id,
            terminal_name: terminal.terminal_name,
            data: lines,
        });
    } catch (error) {
        console.error('Error fetching lines for terminal manager:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching lines for terminal manager.',
        });
    }
};





exports.createLine = async (req, res) => {
    try {
        const userId = req.user.id;
        const {line_manager_id ,line_name, lat, long } = req.body;

        const terminal = await Terminal.findOne({ where: { user_id: userId } });
        if (!terminal) {
            return res.status(404).json({ message: 'Terminal not found for this user.' });
        }

        const newLine = await Line.create({
            terminal_id: terminal.terminal_id,
            line_name,
            lat,
            long,
            line_manager_id: line_manager_id,
        });

        return res.status(201).json(newLine);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create line.', error });
    }
};

exports.updateLine = async (req, res) => {
    try {
        const userId = req.user.id;
        const { line_id } = req.params;
        const { line_manager_id,line_name, lat, long } = req.body;

        const terminal = await Terminal.findOne({ where: { user_id: userId } });
        if (!terminal) {
            return res.status(404).json({ message: 'Terminal not found for this user.' });
        }

        const line = await Line.findOne({
            where: { line_id, terminal_id: terminal.terminal_id },
        });
        if (!line) {
            return res.status(404).json({ message: 'Line not found or not linked to this terminal.' });
        }

        await line.update({ line_manager_id ,line_name, lat, long });

        return res.status(200).json(line);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update line.', error });
    }
};

exports.deleteLine = async (req, res) => {
    try {
        const userId = req.user.id;
        const { line_id } = req.params;

        const terminal = await Terminal.findOne({ where: { user_id: userId } });
        if (!terminal) {
            return res.status(404).json({ message: 'Terminal not found for this user.' });
        }

        const line = await Line.findOne({
            where: { line_id, terminal_id: terminal.terminal_id },
        });
        if (!line) {
            return res.status(404).json({ message: 'Line not found or not linked to this terminal.' });
        }

        await line.destroy();

        return res.status(200).json({ message: 'Line deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete line.', error });
    }
};





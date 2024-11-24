//lineController.js
const Line=require('../models/Line');
const Vehicle = require('../models/Vehicle');
const { Op } = require('sequelize');



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


const getDriversByLineManager = async (req, res) => {
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


module.exports = { getLineManagerByDriver, getDriversByLineManager };


>>>>>>> fb0259cc49869e302eb08cee10937924f7188ef4



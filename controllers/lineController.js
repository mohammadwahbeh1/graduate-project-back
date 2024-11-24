//lineController.js
const Line=require('../models/Line');
const Vehicle = require('../models/Vehicle');

const User = require('../models/User');

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




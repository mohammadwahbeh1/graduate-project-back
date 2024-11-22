//lineController.js
const Line=require('../models/Line');
const Vehicle = require('../models/Vehicle');

const User = require('../models/User');

const getLineManagerByDriver = async (req, res) => {
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

module.exports = { getLineManagerByDriver };



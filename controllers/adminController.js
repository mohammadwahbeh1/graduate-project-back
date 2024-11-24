// controllers/adminController.js
const User = require('../models/User'); 
const Terminal = require('../models/Terminal');
const Vehicle = require('../models/Vehicle');

const Line = require('../models/Line');
const sequelize = require('../db');
const {QueryTypes} = require("sequelize");


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
        const { terminal_id, line_manger_id } = req.body; 

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




module.exports.getLinesAndManagers = async (req, res) => {
    try {
        const terminalManagerId = req.user.id; // الحصول على معرف المدير (admin)

        // 1. استعلام للحصول على التيرمنال الذي يديره هذا المدير
        const terminal = await Terminal.findOne({
            where: {
                user_id: terminalManagerId // البحث عن التيرمنال الذي يملكه هذا المدير
            }
        });

        // إذا لم يتم العثور على التيرمنال
        if (!terminal) {
            return res.status(404).json({
                success: false,
                message: 'Terminal not found for this manager.',
            });
        }

        // 2. استعلام للحصول على الخطوط التي تخص هذا التيرمنال
        const lines = await Line.findAll({
            where: {
                terminal_id: terminal.terminal_id, // جلب الخطوط التي تنتمي إلى التيرمنال الذي يخص المدير
            },
            include: [
                {
                    model: User,
                    as: 'lineManager',
                    attributes: ['user_id', 'username'], // جلب اسم المدير ورقم ال id
                },
            ],
            attributes: ['line_id', 'line_name'], // جلب اسم الخط ورقمه
        });

        // إذا لم يتم العثور على خطوط لهذا التيرمنال
        if (lines.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No lines found for this terminal.',
            });
        }

        // 3. تنسيق البيانات للإرجاع
        const formattedData = lines.map((line) => ({
            lineId: line.line_id,
            lineName: line.line_name,
            managerName: line.lineManager ? line.lineManager.username : 'No manager assigned', // التحقق من وجود مدير للخط
        }));

        // إرجاع الاستجابة
        res.status(200).json({
            success: true,
            data: formattedData,
        });
    } catch (error) {
        console.error('Error fetching lines and managers:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching lines and managers.',
        });
    }
};


module.exports.getDriversAndLines = async (req, res) => {
    try {
        const terminalManagerId = req.user.id; // الحصول على معرف المدير (admin)

        // استعلام للحصول على السائقين مع الخطوط المرتبطة بهم
        const driversAndLines = await sequelize.query(
            `SELECT 
                u.username AS driver_name, 
                u.phone_number AS driver_phone,
                l.line_name AS line_name
            FROM 
                Users u
            JOIN Vehicles v ON v.driver_id = u.user_id
            JOIN \`Lines\` l ON v.line_id = l.line_id
            JOIN Terminals t ON l.terminal_id = t.terminal_id
            WHERE 
                t.user_id = :terminalManagerId`,
            {
                replacements: { terminalManagerId },
                type: sequelize.QueryTypes.SELECT
            }
        );

        // إرجاع البيانات
        res.status(200).json({
            success: true,
            data: driversAndLines,
        });
    } catch (error) {
        console.error('Error fetching drivers and lines:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching drivers and lines.',
        });
    }
};


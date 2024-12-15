// controllers/adminController.js
const User = require('../models/User'); 
const Terminal = require('../models/Terminal');
const Vehicle = require('../models/Vehicle');
const Reviews = require('../models/Reviews');

const Reservation = require('../models/Reservation');

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
module.exports.getAllAdmin = async (req, res) => {
    try {
        const admin = await User.findAll({ where: { role: 'admin' } });
        res.status(200).json({
            status: 'success',
            data: admin
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
        const [results, metadata] = await sequelize.query(`
            SELECT
                t.terminal_id,
                t.terminal_name,
                t.user_id,
                t.latitude,
                t.longitude,
                COUNT(v.vehicle_id) AS vehicleCount
            FROM
                \`Terminals\` AS t
                    LEFT JOIN
                \`Lines\` AS l ON t.terminal_id = l.terminal_id
                    LEFT JOIN
                \`Vehicles\` AS v ON l.line_id = v.line_id
            GROUP BY
                t.terminal_id, t.terminal_name, t.total_vehicles, t.user_id, t.latitude, t.longitude
        `);

        res.status(200).json({
            status: 'success',
            data: results
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


module.exports.getUsersStatistics = async (req, res) => {
    try {
        const roleDistribution = await User.findAll({
            attributes: ['role', [sequelize.fn('COUNT', sequelize.col('role')), 'count']],
            group: ['role']
        });

        const genderDistribution = await User.findAll({
            attributes: ['gender', [sequelize.fn('COUNT', sequelize.col('gender')), 'count']],
            group: ['gender']
        });

        // Age group calculation
        const [ageGroups] = await sequelize.query(`
            SELECT 
                CASE 
                    WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 18 AND 25 THEN '18-25'
                    WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 26 AND 35 THEN '26-35'
                    WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 36 AND 45 THEN '36-45'
                    ELSE '46+' 
                END AS age_group, 
                COUNT(*) AS count
            FROM Users
            GROUP BY age_group;
        `);

        res.json({ roleDistribution, genderDistribution, ageGroups });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports.getLinesWithVehicleCount = async (req, res) => {
    try {
        const terminalManagerId = req.user.id;

        const results = await sequelize.query(
            `
            SELECT 
                l.line_id,
                l.line_name,
                COUNT(v.vehicle_id) AS vehicle_count
            FROM 
                \`Lines\` l
            INNER JOIN 
                \`Terminals\` t ON l.terminal_id = t.terminal_id
            LEFT JOIN 
                \`Vehicles\` v ON l.line_id = v.line_id
            WHERE 
                t.user_id = :terminalManagerId
            GROUP BY 
                l.line_id, l.line_name;
            `,
            {
                replacements: { terminalManagerId },
                type: sequelize.QueryTypes.SELECT
            }
        );

        res.json({ lines: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports.getLineCountByManager = async (req, res) => {
    try {
        const userId = req.user.id;


        const [results] = await sequelize.query(
            `
                SELECT t.terminal_name, COUNT(l.line_id) AS line_count
                FROM \`Terminals\` t
                         LEFT JOIN \`Lines\` l ON t.terminal_id = l.terminal_id
                WHERE t.user_id = :userId
                GROUP BY t.terminal_id
            `,
            {
                replacements: { userId },
                type: sequelize.QueryTypes.SELECT
            }
        );

        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports.getReservationStatistics = async (req, res) => {
    try {
        const reservationsByStatus = await Reservation.findAll({
            attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'count']],
            group: ['status']
        });

        res.json({ reservationsByStatus });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




module.exports.getReviewStatistics = async (req, res) => {
    try {
        const userId = req.user.id;

        const results = await sequelize.query(
            `
                SELECT
                    r.terminal_id,
                    r.rating,
                    COUNT(*) AS count,
                    subquery.average_rating
                FROM
                    Reviews r
                        INNER JOIN
                    Terminals t ON r.terminal_id = t.terminal_id
                        INNER JOIN
                    (
                        SELECT
                            terminal_id,
                            AVG(rating) AS average_rating
                        FROM
                            Reviews
                        GROUP BY
                            terminal_id
                    ) AS subquery ON r.terminal_id = subquery.terminal_id
                WHERE
                    t.user_id = :userId
                GROUP BY
                    r.terminal_id, r.rating;
            `,
            {
                replacements: { userId },
                type: sequelize.QueryTypes.SELECT
            }
        );

        // إعادة تشكيل البيانات لتكون مناسبة للعرض
        const data = {};
        results.forEach(({ terminal_id, rating, count, average_rating }) => {
            if (!data[terminal_id]) {
                data[terminal_id] = {
                    ratings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                    average_rating: parseFloat(average_rating)
                };
            }
            data[terminal_id].ratings[rating] = count;
        });

        res.json({ terminals: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

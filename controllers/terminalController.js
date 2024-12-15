// controllers/terminalController.js

const { Op } = require('sequelize');  // Use this import

const Line = require('../models/Line');
const Vehicle = require('../models/Vehicle');
const Terminal = require('../models/Terminal');
const User = require('../models/User');
const sequelize = require('../db');


module.exports.getAllTerminals = async (req, res) => {
    try {
        const terminals = await Terminal.findAll();

        res.status(200).json({
            status: 'success',
            results: terminals.length,
            data: terminals
        });

    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: `Error fetching terminals: ${err.message}`
        });
    }
};

module.exports.getATerminal = async (req, res) => {
    try {
        const terminal = await Terminal.findOne({
            where: {
                terminal_id: req.params.id
            }
        });
        if (terminal) {
            res.status(200).json({
                status: 'success',
                data: terminal
            });
        } else {
            res.status(404).json({
                status: 'error',
                message: 'Terminal not found'
            });
        }

    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: `Error fetching terminal: ${err.message}`
        });
    }
};




module.exports.getLinesByTerminal = async (req, res) => {
    const terminalId = req.params.id;

// التحقق من صحة معرف التيرمنال (اختياري)
    if (isNaN(terminalId)) {
        return res.status(400).json({
            status: 'error',
            message: 'معرف التيرمنال غير صالح'
        });
    }

    try {
        const query = `
            SELECT
                \`l\`.\`line_id\`,
                \`l\`.\`line_name\`,
                \`l\`.\`last_updated\`,
                \`l\`.\`lat\`,
                \`l\`.\`long\`,
                COUNT(\`v\`.\`vehicle_id\`) AS current_vehicles_count
            FROM
                \`Lines\` \`l\`
                    LEFT JOIN
                \`Vehicles\` \`v\` ON \`l\`.\`line_id\` = \`v\`.\`line_id\` AND \`v\`.\`current_status\` = 'in_terminal'
            WHERE
                \`l\`.\`terminal_id\` = :terminalId
            GROUP BY
                \`l\`.\`line_id\`, \`l\`.\`line_name\`, \`l\`.\`last_updated\`
            ORDER BY
                \`l\`.\`line_name\` ASC
        `;

        // استرجاع النتائج من قاعدة البيانات
        const lines = await sequelize.query(query, {
            replacements: { terminalId },
            type: sequelize.QueryTypes.SELECT // التأكد من استخدام QueryTypes.SELECT
        });

        // إضافة سجلات لمراجعة البيانات
        console.log('Fetched lines:', lines);

        // التأكد من أنه لا يوجد تكرار
        const uniqueLines = lines.flat(); // في حال كانت النتيجة مصفوفات مكررة داخل مصفوفة، يمكن "تفكيك" المصفوفات

        if (uniqueLines.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'لا توجد خطوط في هذا التيرمنال أو لا توجد سيارات في التيرمنال حالياً'
            });
        }

        res.status(200).json({
            status: 'success',
            results: uniqueLines.length,
            data: uniqueLines
        });

    } catch (error) {
        console.error('Error fetching lines for terminal:', error);
        res.status(400).json({
            status: 'error',
            message: `Error fetching lines for terminal: ${error.message}`
        });
    }


};

module.exports.getAllTerminalsManager = async (req, res) => {
    try {
        const lineManagers = await User.findAll({
            where: {
                role: 'line_manager'
            },
            attributes: ['username', 'phone_number']
        });

        if (lineManagers.length > 0) {
            res.status(200).json({
                status: 'success',
                results: lineManagers.length,
                data: lineManagers
            });
        } else {
            res.status(404).json({
                status: 'error',
                message: 'No line managers found'
            });
        }
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: `Error fetching line managers: ${error.message}`
        });
    }
};

exports.createTerminal = async (req, res) => {
    try {
        const { terminal_name, latitude =0.0, longitude=0.0, total_vehicles, user_id } = req.body;

        const newTerminal = await Terminal.create({
            terminal_name,
            latitude,
            longitude,
            total_vehicles,
            user_id,
        });

        res.status(201).json({ success: true, data: newTerminal });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to create terminal', error: error.message });
    }
};

exports.updateTerminal = async (req, res) => {
    try {
        const { id } = req.params;
        const { terminal_name, latitude, longitude, total_vehicles, user_id } = req.body;

        const terminal = await Terminal.findByPk(id);
        if (!terminal) {
            return res.status(404).json({ success: false, message: 'Terminal not found' });
        }

        const updatedTerminal = await terminal.update({
            terminal_name,
            latitude,
            longitude,
            total_vehicles,
            user_id,
        });

        res.status(200).json({ success: true, data: updatedTerminal });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update terminal', error: error.message });
    }
};

// Delete a terminal
exports.deleteTerminal = async (req, res) => {
    try {
        const { id } = req.params;

        const terminal = await Terminal.findByPk(id);
        if (!terminal) {
            return res.status(404).json({ success: false, message: 'Terminal not found' });
        }

        // Step 1: Get all the line_ids for lines that are associated with the terminal
        const lines = await Line.findAll({ where: { terminal_id: id } });
        const lineIds = lines.map(line => line.line_id);

        // Step 2: Disassociate all vehicles from the lines for the terminal by setting line_id to null
        await Vehicle.update(
            { line_id: null }, // Set line_id to null to disassociate vehicles
            {
                where: {
                    line_id: { [Op.in]: lineIds } // Use Op directly here for the 'in' operator
                }
            });

        // Step 3: Delete all Lines that reference the terminal
        await Line.destroy({ where: { terminal_id: id } });

        // Step 4: Now delete the terminal
        await terminal.destroy();
        res.status(200).json({ success: true, message: 'Terminal deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete terminal', error: error.message });
    }
};





module.exports.getTerminalPosition = async (req, res) => {
  try {
    // Extract driver ID from the JWT token
    const driverId = req.user.id; // Assuming you've decoded the JWT and attached `user` to the request

    // Find the vehicle associated with the driver
    const vehicle = await Vehicle.findOne({
      where: { driver_id: driverId },
      include: {
        model: Line,
        as: 'line',
        include: {
          model: Terminal,
          as: 'terminal',
        },
      },
    });
     

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found for the driver' });
    }

    const terminal = vehicle.line.terminal;
    console.log("the terminal info : " + terminal);

    if (!terminal) {
      return res.status(404).json({ message: 'Terminal not found for the driver\'s line' });
    }

    // Return the terminal position
    res.status(200).json({
      terminal_id: terminal.terminal_id,
      terminal_name: terminal.terminal_name,
      latitude: terminal.latitude,
      longitude: terminal.longitude,
    });
  } catch (error) {
    console.error('Error fetching terminal position:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports.getLinesWithVehicleLocations = async (req, res) => {
    try {
        const terminalId = req.params.id;

        if (isNaN(terminalId)) {
            return res.status(400).json({
                status: 'error',
                message: 'معرف التيرمنال غير صالح'
            });
        }

        const terminalQuery = `
            SELECT latitude AS terminal_lat, longitude AS terminal_long
            FROM \`Terminals\`
            WHERE terminal_id = :terminalId;
        `;

        const terminal = await sequelize.query(terminalQuery, {
            replacements: { terminalId },
            type: sequelize.QueryTypes.SELECT
        });

        if (terminal.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'التيرمنال غير موجود'
            });
        }

        const terminalLat = terminal[0].terminal_lat;
        const terminalLong = terminal[0].terminal_long;

        const query = `
            SELECT
                l.line_id,
                l.line_name,
                l.last_updated,
                l.lat AS line_lat,
                l.long AS line_long,
                v.vehicle_id,
                v.latitude AS vehicle_lat,
                v.longitude AS vehicle_long
            FROM
                \`Lines\` l
                    LEFT JOIN
                \`Vehicles\` v ON l.line_id = v.line_id
            WHERE
                l.terminal_id = :terminalId
              AND v.current_status = 'in_terminal'
            ORDER BY
                l.line_name ASC;
        `;

        // استرجاع النتائج من قاعدة البيانات
        const results = await sequelize.query(query, {
            replacements: { terminalId },
            type: sequelize.QueryTypes.SELECT
        });

        // التأكد من وجود نتائج
        if (results.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'لا توجد بيانات لهذا التيرمنال أو لا توجد سيارات في التيرمنال حالياً'
            });
        }

        // دالة لحساب المسافة بين نقطتين باستخدام صيغة Haversine
        const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const R = 6371; // نصف قطر الكرة الأرضية بالكيلومتر
            const dLat = (lat2 - lat1) * (Math.PI / 180);
            const dLon = (lon2 - lon1) * (Math.PI / 180);

            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * (Math.PI / 180)) *
                Math.cos(lat2 * (Math.PI / 180)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            return R * c; // المسافة بالكيلومتر
        };

        // تنظيم البيانات بشكل مناسب مع إضافة المسافة وlast_updated
        const linesWithVehicles = results.reduce((acc, row) => {
            const lineDistance = calculateDistance(terminalLat, terminalLong, row.line_lat, row.line_long);
            const vehicleDistance = calculateDistance(terminalLat, terminalLong, row.vehicle_lat, row.vehicle_long);

            // العثور على الخط
            const line = acc.find(item => item.line_id === row.line_id);
            if (line) {
                // إضافة السيارة مع المسافة الخاصة بها
                line.vehicles.push({
                    vehicle_id: row.vehicle_id,
                    vehicle_lat: row.vehicle_lat,
                    vehicle_long: row.vehicle_long,
                    distance_from_terminal: vehicleDistance
                });
            } else {
                // إذا كان الخط غير موجود بعد، أضفه مع السيارة
                acc.push({
                    line_id: row.line_id,
                    line_name: row.line_name,
                    last_updated: row.last_updated, // إضافة last_updated هنا
                    line_lat: row.line_lat,
                    line_long: row.line_long,
                    distance_from_terminal: lineDistance,
                    vehicles: [{
                        vehicle_id: row.vehicle_id,
                        vehicle_lat: row.vehicle_lat,
                        vehicle_long: row.vehicle_long,
                        distance_from_terminal: vehicleDistance
                    }]
                });
            }
            return acc;
        }, []);

        // إرسال الاستجابة بنجاح
        res.status(200).json({
            status: 'success',
            results: linesWithVehicles.length,
            data: linesWithVehicles
        });

    } catch (error) {
        console.error('Error fetching lines with vehicles and locations:', error);
        res.status(500).json({
            status: 'error',
            message: `Error fetching lines with vehicles: ${error.message}`
        });
    }
};

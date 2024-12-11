const Vehicle = require('../models/Vehicle');
const Line = require('../models/Line');
const User = require('../models/User');
const  Terminal =require('../models/Terminal');

const targetLatitude =32.2149;
const targetLongitude = 35.2828;

const targetRadius = 1000;  


module.exports.createVehicle = async (req, res) => {
    try {
        const {
            driver_id,
            line_id,
            current_status = 'in_terminal',
            latitude = null,
            longitude = null,
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

        // Check if line exists and fetch its manager
        const line = await Line.findByPk(line_id);
        if (!line) {
            return res.status(404).json({ error: 'Line not found.' });
        }

        // Automatically set line_manager_id from the Line model
        const line_manager_id = line.line_manager_id;

        // Create the vehicle
        const vehicle = await Vehicle.create({
            driver_id,
            line_id,
            line_manager_id, // Automatically set
            current_status,
            latitude,
            longitude,
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








// function haversine(lat1, lon1, lat2, lon2) {
//   const R = 6371000; 
//   const φ1 = lat1 * (Math.PI / 180); 
//   const φ2 = lat2 * (Math.PI / 180); 
//   const Δφ = (lat2 - lat1) * (Math.PI / 180); 
//   const Δλ = (lon2 - lon1) * (Math.PI / 180); 
//   const a =
//     Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//     Math.cos(φ1) * Math.cos(φ2) *
//     Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   return R * c; 
// }



module.exports.updateVehicleLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    
    const driverId = req.user.id;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    const vehicle = await Vehicle.findOne({ where: { driver_id: driverId } });
    
    
  
  

    
    vehicle.latitude = latitude;
    vehicle.longitude = longitude;

    
    await vehicle.save();

    return res.status(200).json({
      message: 'Vehicle location updated successfully',
      vehicle: {
        vehicle_id: vehicle.vehicle_id,
        latitude: vehicle.latitude,
        longitude: vehicle.longitude,
      },
    });
  } catch (error) {
    console.error('Error updating vehicle location:', error);
    return res.status(500).json({ error: 'An error occurred while updating vehicle location' });
  }
};


module.exports.updateVehicle = async (req, res) => {
    try {
        const { id } = req.params; // vehicle_id from URL params
        const {
            driver_id,
            line_id,
            current_status,
            latitude,
            longitude,
        } = req.body;

        // تحقق من وجود المركبة
        const vehicle = await Vehicle.findByPk(id);
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found.' });
        }

        let line_manager_id = vehicle.line_manager_id; // احتفظ بـ line_manager_id الحالي بشكل افتراضي

        // إذا تم تغيير الخط، جلب معلومات الخط الجديد
        if (line_id && line_id !== vehicle.line_id) {
            const line = await Line.findByPk(line_id);
            if (!line) {
                return res.status(404).json({ error: 'Line not found.' });
            }
            line_manager_id = line.line_manager_id; // تحديث line_manager_id بناءً على الخط الجديد
        }

        // تحديث المركبة
        await vehicle.update({
            driver_id,
            line_id,
            line_manager_id, // تحديث line_manager_id إذا تغير الخط
            current_status,
            latitude,
            longitude,
        });

        res.status(200).json({
            success: true,
            message: 'Vehicle updated successfully.',
            data: vehicle,
        });
    } catch (error) {
        console.error('Error updating vehicle:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};


module.exports.deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params; // vehicle_id from URL params

        const vehicle = await Vehicle.findByPk(id);
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found.' });
        }

        await vehicle.destroy();

        res.status(200).json({
            success: true,
            message: 'Vehicle deleted successfully.',
        });
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports.getVehiclesByTerminal = async (req, res) => {
    try {
        const terminalManagerId = req.user.id;

        const terminal = await Terminal.findOne({
            where: { user_id: terminalManagerId }
        });

        if (!terminal) {
            return res.status(404).json({ message: "Terminal not found for this manager" });
        }

        const lines = await Line.findAll({
            where: { terminal_id: terminal.terminal_id }
        });

        if (!lines.length) {
            return res.status(404).json({ message: "No lines found for this terminal" });
        }

        const lineIds = lines.map(line => line.line_id);

        const vehicles = await Vehicle.findAll({
            where: {
                line_id: lineIds
            },
            include: [
                { model: Line, as: 'line' }, // إضافة معلومات الخط
                { model: User, as: 'driver' }, // إضافة معلومات السائق
                { model: User, as: 'line_manager' } // إضافة معلومات مدير الخط
            ]
        });

        if (!vehicles.length) {
            return res.status(404).json({ message: "No vehicles found for this terminal" });
        }

        return res.status(200).json(vehicles);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};


module.exports.stit = async (req, res) => {
    try {
        const stats = await Line.findAll({
            include: [
                {
                    model: Vehicle,
                    where: { current_status: 'on_the_way' }, // Show vehicles that are 'on_the_way'
                    attributes: ['vehicle_id'],
                    required: false,
                },
                {
                    model: Vehicle,
                    where: { current_status: 'in_terminal' }, // Show vehicles that are 'in_terminal'
                    attributes: ['vehicle_id'],
                    required: false,
                },
            ],
            attributes: ['line_id', 'line_name'],
        });

        const formattedStats = stats.map(line => ({
            line_name: line.line_name,
            total_vehicles: line.Vehicles.length,
            on_the_way: line.Vehicles.filter(v => v.current_status === 'on_the_way').length,
            in_terminal: line.Vehicles.filter(v => v.current_status === 'in_terminal').length,
        }));

        res.json(formattedStats);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    } }

module.exports.getDriversLocation = async (req, res) => {
    try {
        const lineManagerId = req.user.id;

        // Fetch all vehicles with their driver info for the line manager
        const vehicles = await Vehicle.findAll({
            where: {
                line_manager_id: lineManagerId,
                current_status: 'on_the_way', // Only vehicles that are on the way
            },
            include: [
                {
                    model: User,
                    as: 'driver',
                    attributes: ['user_id', 'username', 'phone_number', 'email']
                }
            ],
            attributes: ['vehicle_id', 'latitude', 'longitude']
        });

        if (vehicles.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No vehicles found for the line manager'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Driver locations fetched successfully',
            data: vehicles
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: `Error fetching driver locations: ${error.message}`
        });
    }
};


module.exports.incrementVehicleCount = async(req,res)=>{

    try {
        const driver_id  = req.user.id;  
        console.log(driver_id);
    
        const vehicle = await Vehicle.findOne({
          where: { driver_id },
          include: {
            model: Line,
            as: 'line', // Including the associated Line
          },
        });
    
        if (!vehicle || !vehicle.line) {
          return res.status(404).json({ status: 'error', message: 'Vehicle or line not found' });
        }
    
        
        await vehicle.line.increment('current_vehicles_count', { by: 1 });
    
        
        res.status(200).json({ status: 'success', message: 'Vehicle count incremented successfully' });
    
      } catch (error) {
        console.error('Error incrementing vehicle count:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
      }


};


module.exports.decrementVehicleCount = async(req,res)=>{

    try {
        const  driver_id = req.user.id;  
    
        
        const vehicle = await Vehicle.findOne({
          where: { driver_id },
          include: {
            model: Line,
            as: 'line', 
          },
        });
    
        if (!vehicle || !vehicle.line) {
          return res.status(404).json({ status: 'error', message: 'Vehicle or line not found' });
        }
    
        
        await vehicle.line.decrement('current_vehicles_count', { by: 1 });
    
       
        res.status(200).json({ status: 'success', message: 'Vehicle count decremented successfully' });
    
      } catch (error) {
        console.error('Error decrementing vehicle count:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
      }


};


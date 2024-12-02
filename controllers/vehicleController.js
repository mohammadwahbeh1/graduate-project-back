const Vehicle = require('../models/Vehicle');
const Line = require('../models/Line');
const User = require('../models/User');
const targetLatitude = 32.2149;
const targetLongitude = 35.2828;
const targetRadius = 1000; 



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








function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000; 
  const φ1 = lat1 * (Math.PI / 180); 
  const φ2 = lat2 * (Math.PI / 180); 
  const Δφ = (lat2 - lat1) * (Math.PI / 180); 
  const Δλ = (lon2 - lon1) * (Math.PI / 180); 
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; 
}

module.exports.updateVehicleLocation = async (req, res) => {
  try {
    const driverId = req.user.id;
    const { longitude, latitude } = req.body;

    if (!longitude || !latitude) {
      return res.status(400).json({
        status: 'error',
        message: 'Longitude and latitude are required.',
      });
    }

    const vehicle = await Vehicle.findOne({
      where: {
        driver_id: driverId,
      },
    });

    if (!vehicle) {
      return res.status(404).json({
        status: 'error',
        message: 'Vehicle not found for this driver.',
      });
    }

  
    const distance = haversine(latitude, longitude, targetLatitude, targetLongitude);

    const line = await Line.findOne({
      where: { line_id: vehicle.line_id },
    });

    if (line) {
      
      const wasInsideRadius = vehicle.previous_location_within_radius;

     
      const isInsideRadius = distance <= targetRadius;

      
      await vehicle.update({
        latitude: latitude,
        longitude: longitude,
        previous_location_within_radius: isInsideRadius, 
         current_status: isInsideRadius ? 'in_terminal' : 'on_the_way'
      });

     
      if (isInsideRadius && !wasInsideRadius) {
        
        await line.increment('current_vehicles_count', { by: 1 });
       
        
      } else if (!isInsideRadius && wasInsideRadius) {
        
        await line.decrement('current_vehicles_count', { by: 1 });
        
      }
    }

    res.status(200).json({
      status: 'success',
      message: 'Vehicle location updated successfully.',
      data: vehicle,
    });
  } catch (err) {
    console.error('Error updating vehicle location:', err);
    res.status(500).json({
      status: 'error',
      message: `Error updating vehicle location: ${err.message}`,
    });
  }
};

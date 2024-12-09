const vehicleController = require('../controllers/vehicleController');
const express = require('express');
const router = express.Router();
const authenticate=require('../middleware/protectRoutes');

router.patch('/increment', authenticate, vehicleController.incrementVehicleCount);

router.patch('/decrement', authenticate, vehicleController.decrementVehicleCount);

router.post('/',authenticate, vehicleController.createVehicle);
router.get('/', authenticate, vehicleController.getVehiclesByTerminal);




router.put('/:id', authenticate, vehicleController.updateVehicle);
router.patch('/update-location', authenticate, vehicleController.updateVehicleLocation);

router.delete('/:id', authenticate, vehicleController.deleteVehicle);

router.get('/vehicle-stats',authenticate, vehicleController.stit);



module.exports = router;
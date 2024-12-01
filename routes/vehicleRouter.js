const vehicleController = require('../controllers/vehicleController');
const express = require('express');
const router = express.Router();
const authenticate=require('../middleware/protectRoutes');




router.post('/',authenticate, vehicleController.createVehicle);
router.get('/', authenticate, vehicleController.getVehiclesByTerminal);


router.put('/:id', authenticate, vehicleController.updateVehicle);

router.delete('/:id', authenticate, vehicleController.deleteVehicle);

router.get('/vehicle-stats',authenticate, vehicleController.stit);


module.exports = router;
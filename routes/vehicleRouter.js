const vehicleController = require('../controllers/vehicleController');
const express = require('express');
const router = express.Router();
const authenticate=require('../middleware/protectRoutes');

//Router.route('/').get();


router.post('/',authenticate, vehicleController.createVehicle);
router.patch('/update-location', authenticate, vehicleController.updateVehicleLocation);


module.exports = router;
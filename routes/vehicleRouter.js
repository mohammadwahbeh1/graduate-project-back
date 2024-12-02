const vehicleController = require('../controllers/vehicleController');
const express = require('express');
const router = express.Router();
const authenticate=require('../middleware/protectRoutes');




router.post('/',authenticate, vehicleController.createVehicle);


module.exports = router;
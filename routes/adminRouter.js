// routes/adminRouter.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/protectRoutes'); 
const authorize = require('../middleware/authorize');
const adminController = require('../controllers/adminController'); 

// Example: Only admins can get all drivers
router.get('/drivers', authenticate, authorize(['admin']), adminController.getAllDrivers);
router.get('/line-managers', authenticate, authorize(['admin']), adminController.getAllLineManagers);
router.get('/terminals', authenticate, authorize(['admin']), adminController.getAllTerminals);
router.get('/vehicles', authenticate, authorize(['admin']), adminController.getAllVehicles);


router.patch('/user/:id', authenticate, authorize(['admin']), adminController.updateAUser);
router.patch('/lines/:id', authenticate, authorize(['admin']), adminController.updateLine);

router.get('/line/manger', authenticate, authorize(['admin']) ,adminController.getLinesAndManagers);
router.get('/ine/driver', authenticate, authorize(['admin']) ,adminController.getDriversAndLines);






module.exports = router;

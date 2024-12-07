// routes/adminRouter.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/protectRoutes'); 
const authorize = require('../middleware/authorize');
const adminController = require('../controllers/adminController'); 

// Example: Only admins can get all drivers
router.get('/drivers', authenticate, authorize(['admin']), adminController.getAllDrivers);
router.get('/admin', authenticate, authorize(['admin']), adminController.getAllAdmin);
router.get('/line-managers', authenticate, authorize(['admin']), adminController.getAllLineManagers);
router.get('/terminals', authenticate, authorize(['admin']), adminController.getAllTerminals);
router.get('/vehicles', authenticate, authorize(['admin']), adminController.getAllVehicles);


router.patch('/user/:id', authenticate, authorize(['admin']), adminController.updateAUser);
router.patch('/lines/:id', authenticate, authorize(['admin']), adminController.updateLine);

router.get('/line/manger', authenticate, authorize(['admin']) ,adminController.getLinesAndManagers);
router.get('/ine/driver', authenticate, authorize(['admin']) ,adminController.getDriversAndLines);

router.get('/users/statistics', authenticate, authorize(['admin']), adminController.getUsersStatistics);
router.get('/vehicles/statistics', authenticate, authorize(['admin']), adminController.getLinesWithVehicleCount);
router.get('/lines/statistics', authenticate, authorize(['admin']), adminController.getLineCountByManager);
router.get('/reservations/statistics', authenticate, authorize(['admin']), adminController.getReservationStatistics);
router.get('/reviews/statistics', authenticate, authorize(['admin']), adminController.getReviewStatistics);





module.exports = router;

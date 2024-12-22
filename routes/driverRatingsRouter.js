// routes/driverRatingsRouter.js

const express = require('express');
const router = express.Router();
const DriverRatingController = require('../controllers/DriverRatingController');
const authenticate=require('../middleware/protectRoutes');


// Route to create a new driver rating
router.post('/',authenticate, DriverRatingController.createOrUpdateDriverRating);


// Route to update an existing driver rating

// Route to delete a driver rating
router.delete('/:id',authenticate, DriverRatingController.deleteDriverRating);

module.exports = router;

const express = require('express');
const router = express.Router();
const driverQueController = require('../controllers/driverQueController');



const upload = require('../middleware/upload');

router.post('/drivers', upload.single('license_image'), driverQueController.createDriver);
router.get('/', driverQueController.getAllDrivers);
router.delete('/:id', driverQueController.deleteDriver);
router.post('/accept-driver/:id', driverQueController.acceptDriver);


module.exports = router;

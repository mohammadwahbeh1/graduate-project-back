const express = require('express');
const router = express.Router();
const driverQueController = require('../controllers/driverQueController');



const upload = require('../middleware/upload');
const authenticate = require("../middleware/protectRoutes");
const authorize = require("../middleware/authorize");

router.post('/drivers', upload.single('license_image'), driverQueController.createDriver);
router.get('/',authenticate, authorize(['admin']), driverQueController.getAllDrivers);
router.delete('/:id',authenticate, authorize(['admin']), driverQueController.deleteDriver);
router.post('/accept-driver/:id',authenticate, authorize(['admin']), driverQueController.acceptDriver);


module.exports = router;

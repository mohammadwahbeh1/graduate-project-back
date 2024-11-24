const express = require('express');
const router = express.Router();
const lineController = require('../controllers/lineController');
const authenticate=require('../middleware/protectRoutes');



//Router.route('/').get();
router.route('/location').get(authenticate, lineController.getLineLocation);
router.get('/drivers/line-manager',authenticate, lineController.getLineManagerByDriver);
router.get('/line-manager/drivers',authenticate, lineController.getDriversByLineManager);


module.exports = router;

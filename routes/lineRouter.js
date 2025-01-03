const express = require('express');
const router = express.Router();
const lineController = require('../controllers/lineController');
const authenticate=require('../middleware/protectRoutes');



//Router.route('/').get();
router.route('/all').get(authenticate, lineController.getAllLineLocations);
router.route('/location').get(authenticate, lineController.getLineLocation);

router.get('/drivers/line-manager',authenticate, lineController.getLineManagerByDriver);

router.get('/line-manager/drivers',authenticate, lineController.getDriversByLineManager);
router.get('/term/line',authenticate, lineController.getLinesByTerminalManager);


router.get('/driver/rating',authenticate, lineController.getDriverRating);

router.get('/drivers/locations', authenticate, lineController.getDriversLocation);

router.post('/create', authenticate, lineController.createLine);

router.put('/update/:line_id', authenticate, lineController.updateLine);

router.delete('/delete/:line_id', authenticate, lineController.deleteLine);


module.exports = router;

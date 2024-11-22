const express = require('express');
const router = express.Router();
const lineController = require('../controllers/lineController');
const authenticate=require('../middleware/protectRoutes');



//Router.route('/').get();

router.get('/drivers/line-manager',authenticate, lineController.getLineManagerByDriver);

module.exports = router;

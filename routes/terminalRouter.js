// routes/terminalRouter.js

const express = require('express');
const router = express.Router();
const terminalController = require('../controllers/terminalController');

router.route('/:id/lines').get(terminalController.getLinesWithVehiclesCount); // استخدام الدالة الجديدة

module.exports = router;

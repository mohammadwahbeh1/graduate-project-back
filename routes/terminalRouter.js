// routes/terminalRouter.js

const express = require('express');
const Router = express.Router();
const terminalController = require('../controllers/terminalController');
const authenticate=require('../middleware/protectRoutes'); 

Router
.route('/').get(authenticate,terminalController.getAllTerminals);

Router
.route('/manager').get(authenticate,terminalController.getAllTerminalsManager);

Router
.route('/:id').get(authenticate,terminalController.getATerminal);
Router
.route('/:id/lines').get(authenticate,terminalController.getLinesByTerminal);



module.exports = Router;

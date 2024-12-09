// routes/terminalRouter.js

const express = require('express');
const Router = express.Router();
const terminalController = require('../controllers/terminalController');
const authenticate=require('../middleware/protectRoutes');

Router.route('/terminal-position').get(authenticate,terminalController.getTerminalPosition);

Router
    .route('/')
    .get(authenticate, terminalController.getAllTerminals) // Existing route
    .post(authenticate, terminalController.createTerminal); // New POST route for creating a terminal

Router
    .route('/:id')
    .get(authenticate, terminalController.getATerminal) // Existing route
    .put(authenticate, terminalController.updateTerminal) // New PUT route for updating a terminal
    .delete(authenticate, terminalController.deleteTerminal); // New DELETE route for deleting a terminal


Router
.route('/manager/all').get(authenticate,terminalController.getAllTerminalsManager);


Router
.route('/:id/lines').get(authenticate,terminalController.getLinesByTerminal);





module.exports = Router;

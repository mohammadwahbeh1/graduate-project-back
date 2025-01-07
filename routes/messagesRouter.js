const express = require('express');
const Router = express.Router();
const authenticate= require('../middleware/protectRoutes');
const messagesController=require('../controllers/messagesController');


Router.route('/').get(authenticate,messagesController.getMessages);

Router.route('/conversation/:userId').get(authenticate,messagesController.getMessageById);


Router.route('/').post(authenticate,messagesController.postMessages);

module.exports = Router;
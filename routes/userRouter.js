const express = require('express');
const Router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/protectRoutes');


Router.route('/profile')
.get(authenticate,userController.getAuser);

Router.route('/')
    .get(authenticate,userController.getAllUsers);




module.exports = Router;

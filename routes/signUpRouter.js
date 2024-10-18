
const express = require('express');
const Router = express.Router();
const authController = require('../controllers/authenticationController');
Router.post('/', authController.register);

module.exports = Router;
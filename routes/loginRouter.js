// routes/auth.js
const express = require('express');
const Router = express.Router();
const authController = require('../controllers/authenticationController');

Router.post('/', authController.login);

module.exports = Router;

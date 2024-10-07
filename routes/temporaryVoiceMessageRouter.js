const express = require('express');
const Router = express.Router();
const voiceMessageController = require('../controllers/temporaryVoiceMessageController.controller');

Router.route('/').get();


module.exports = Router;



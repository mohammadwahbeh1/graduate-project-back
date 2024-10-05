const express=require('express');
const Router = express.Router();
const userController=require('../controller/userController');

Router
.route('/')
.get(userController.getAllUsers);

module.exports = Router;

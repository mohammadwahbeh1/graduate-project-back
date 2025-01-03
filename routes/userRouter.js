const express = require('express');
const Router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/protectRoutes');





Router.route('/reset-password')
 .post(userController.resetPassword); 
 
 Router.route('/forgot-password')
.post(userController.forgotPassword); 

Router.post('/verify-reset-code', userController.verifyCode);

Router.route('/profile')
.get(authenticate,userController.getAuser)
.patch(authenticate, userController.updateProfile);








Router.route('/')
    .get(authenticate,userController.getAllUsers);

Router.route('/update-role')
    .patch(authenticate, userController.updateUserRole);
    





module.exports = Router;

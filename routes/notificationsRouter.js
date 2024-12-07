const express = require('express');
const Router = express.Router();
const authenticate=require('../middleware/protectRoutes');
const notificationsController = require('../controllers/notificationsController');

Router.route('/').get(authenticate,notificationsController.getNotifications);
Router.route('/:id').patch(authenticate,notificationsController.markNotificationAsRead);
Router.route('/:id/driver').post(authenticate, notificationsController.addNotificationsFromDriver);
Router.route('/').post(authenticate,notificationsController.addNotifications);



module.exports = Router;

const express = require('express');
const Router = express.Router();
const authenticate=require('../middleware/protectRoutes'); 
const reservationController = require('../controllers/reservationController');


Router.route('/').post(authenticate,reservationController.createReservation);

Router.route('/:id')
.get(authenticate,reservationController.getReservationById)
.patch(authenticate,reservationController.updateReservation)
.delete( authenticate,reservationController.deleteReservation);
Router.route('/user/:id')
.get(authenticate,reservationController.getAllReservationsForUser);

module.exports =Router;


const express = require('express');
const Router = express.Router();
const authenticate=require('../middleware/protectRoutes'); 
const reservationController = require('../controllers/reservationController');


Router.route('/').post(authenticate,reservationController.createReservation);

Router.route('/:id') .get(authenticate,reservationController.getReservationById)

.patch(authenticate,reservationController.updateReservation) .delete( authenticate,reservationController.deleteReservation);

Router.route('/user/:id').get(authenticate,reservationController.getAllReservationsForUser);




// Get all reservations for a driver
Router.route('/driver/reservations').get(authenticate, reservationController.getAllReservationsByDriver);

// Get all pending reservations for a user
Router.route('/pending/all').get(authenticate, reservationController.getPendingReservations);

// Accept a reservation
Router.route('/accept/:reservationId').patch(authenticate, reservationController.acceptReservation);

// Cancel a reservation
Router.route('/cancel/:reservationId').patch(authenticate, reservationController.cancelReservation);




module.exports =Router;


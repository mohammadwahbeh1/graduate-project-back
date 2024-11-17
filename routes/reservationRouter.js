const express = require('express');
const Router = express.Router();
const reservationController = require('../controllers/reservationController');
const authenticate = require('../middleware/protectRoutes');


Router.route('/').post(authenticate, reservationController.createReservation);


Router.route('/:id')
    .get(authenticate, reservationController.getReservationById)
    .patch(authenticate, reservationController.updateReservation)
    .delete(authenticate, reservationController.deleteReservation);


Router.route('/user/:id').get(authenticate, reservationController.getAllReservationsForUser);


Router.route('/:reservationId/accept')
    .patch( authenticate, reservationController.acceptReservation);

Router.route('/:reservationId/cancel')
    .patch( authenticate, reservationController.cancelReservation);


module.exports = Router;

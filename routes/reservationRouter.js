const express = require('express');
const Router = express.Router();
const reservationController = require('../controllers/reservationController');
const authenticate=require('../middleware/protectRoutes'); 

Router.route('/').post(authenticate,reservationController.createReservation);

Router.route('/:id')
.get(authenticate,reservationController.getReservationById)
.patch(authenticate,reservationController.updateReservation)
.delete( authenticate,reservationController.deleteReservation);
module.exports =Router;


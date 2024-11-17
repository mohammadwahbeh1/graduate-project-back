const express = require('express');
const Router = express.Router();
const reviewsController = require('../controllers/reviewsController');
const authenticate = require("../middleware/protectRoutes");
const reservationController = require("../controllers/reservationController");

Router.post('/add', authenticate, reviewsController.addReview);

Router.get('/:terminalId' , authenticate, reviewsController.getTerminalReviews);

Router.put('/update/:reviewId', authenticate, reviewsController.updateReview);

Router.delete('/delete/:reviewId', authenticate, reviewsController.deleteReview);







module.exports = Router;

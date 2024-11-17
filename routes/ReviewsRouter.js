const express = require('express');
const Router = express.Router();
const reviewsController = require('../controllers/reviewsController');

Router.post('/add', reviewsController.addReview);

Router.get('/:terminalId', reviewsController.getTerminalReviews);

Router.put('/update/:reviewId', reviewsController.updateReview);

Router.delete('/delete/:reviewId', reviewsController.deleteReview);

module.exports = Router;

const Reviews = require('../models/Reviews');
const User = require('../models/User');
const { Op } = require('sequelize');

const reviewsController = {
    async addReview(req, res) {
        const  user_id = req.user.id;
        try {

            const { terminal_id,  comment, rating } = req.body;



            if (!terminal_id || !user_id || !comment || !rating) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            const review = await Reviews.create({
                terminal_id,
                user_id,
                comment,
                rating,
            });

            res.status(201).json(review);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async getTerminalReviews(req, res) {
        try {
            const { terminalId } = req.params;

            const reviews = await Reviews.findAll({
                where: { terminal_id: terminalId },
                attributes: ['review_id', 'comment', 'rating', 'created_at'],
                include: [
                    {
                        model: User,
                        attributes: ['username'],
                    },
                ],
            });

            const totalRatings = reviews.length;
            const averageRating =
                totalRatings > 0
                    ? reviews.reduce((acc, review) => acc + review.rating, 0) / totalRatings
                    : 0;

            res.json({
                totalRatings,
                averageRating: parseFloat(averageRating.toFixed(2)),
                reviews: reviews.map((review) => ({
                    review_id: review.review_id,
                    comment: review.comment,
                    rating: review.rating,
                    created_at: review.created_at,
                    username: review.User.username,
                })),
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async updateReview(req, res) {
        try {
            const { reviewId } = req.params;
            const { comment, rating } = req.body;

            const review = await Reviews.findByPk(reviewId);
            if (!review) {
                return res.status(404).json({ message: 'Review not found' }); 
            }


            review.comment = comment || review.comment;
            review.rating = rating || review.rating;
            review.created_at = new Date();


            await review.save();

            res.json({ message: 'Review updated successfully', review }); 
        } catch (error) {
            res.status(500).json({ message: error.message }); 
        }
    }
    ,

    async deleteReview(req, res) {
        try {
            const { reviewId } = req.params;


            const review = await Reviews.findByPk(reviewId);
            if (!review) {
                return res.status(404).json({ message: 'Review not found' });
            }


            await review.destroy();
            res.json({ message: 'Review deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = reviewsController;

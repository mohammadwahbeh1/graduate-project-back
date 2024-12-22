// controllers/DriverRatingController.js

const DriverRating = require('../models/DriverRating');
const Reservation = require('../models/Reservation');
const User = require('../models/User');
const {where} = require("sequelize");

// Create a new driver rating
exports.createOrUpdateDriverRating = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { reservation_id, driver_id, rating, comment } = req.body;

        const reservation = await Reservation.findByPk(reservation_id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        const user = await User.findByPk(user_id);
        const driver = await User.findByPk(driver_id);
        if (!user || !driver) {
            return res.status(404).json({ message: 'User or Driver not found' });
        }

        const existingRating = await DriverRating.findOne({
            where: { reservation_id, user_id, driver_id },
        });

        if (existingRating) {
            existingRating.rating = rating;
            existingRating.comment = comment;
            await existingRating.save();

            return res.status(200).json({
                message: 'Rating updated successfully',
                data: existingRating,
            });
        } else {
            const newRating = await DriverRating.create({
                reservation_id,
                user_id,
                driver_id,
                rating,
                comment,
            });

            return res.status(201).json({
                message: 'Rating created successfully',
                data: newRating,
            });
        }
    } catch (error) {
        console.error('Error creating/updating driver rating:', error);
        res.status(500).json({
            message: 'An error occurred while creating/updating the rating',
        });
    }
};





// Delete Driver Rating
exports.deleteDriverRating = async (req, res) => {
    try {
        const user_id = req.user.id;
        const reservation_id = req.params.id; // Correct

        // Validate that reservation_id is provided
        if (!reservation_id) {
            return res.status(400).json({ success: false, message: 'Reservation ID must be provided.' });
        }

        // Find the driver rating based on user_id and reservation_id
        const driverRating = await DriverRating.findOne({
            where: {
                user_id,
                reservation_id
            }
        });

        if (!driverRating) {
            return res.status(404).json({ success: false, message: 'Driver rating not found.' });
        }

        await driverRating.destroy();

        res.status(200).json({
            success: true,
            message: 'Driver rating deleted successfully.'
        });
    } catch (error) {
        console.error('Error deleting driver rating:', error);
        res.status(500).json({ success: false, message: 'An error occurred while deleting the rating.' });
    }
};


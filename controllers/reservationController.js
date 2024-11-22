const Reservation=require('../models/Reservation');
const User = require('../models/User');


module.exports.createReservation = async (req, res) => {

    try {
        const { start_destination, end_destination, reservation_type, phone_number } = req.body;
        const user_id = req.user.id;

        const newReservation = await Reservation.create({
            user_id,
            start_destination,
            end_destination,
            reservation_type,
            phone_number,
            status: 'pending',
            created_at: new Date()
        });

        res.status(201).json({
            status: 'success',
            data: newReservation
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: `Error creating reservation: ${error.message}`
        });
    }


}

module.exports.getReservationById = async (req, res) => {
try {
    const reservation=await Reservation.findOne({
        where: {
            reservation_id: req.params.id
        }
    });

    res.status(200).json({
        status:'success',
        data: reservation
    });
} catch (error) {

    res.status(400).json({
        status: 'error',
        message: `Error getting reservation: ${error.message}`
    });
}
}

module.exports.updateReservation = async (req, res) => {

    try {
        const updateReservation = await Reservation.update({

            description: req.body.description,
            last_update: new Date()
        },
        {
            where: {
                reservation_id: req.params.id
            }

        });

        res.status(200).json({
            status:'success',
            message: 'Reservation updated successfully',
            data: updateReservation
        });
    } catch (error) {

        res.status(400).json({
            status: 'error',
            message: `Error updating reservation: ${error.message}`
        });
    }
}

module.exports.deleteReservation = async (req, res) => {
    try {
        const deleteReservation = await Reservation.destroy({
            where: {
                reservation_id: req.params.id
            }
        });

        res.status(200).json({
            status:'success',
            message: 'Reservation deleted successfully'
        });

    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: `Error deleting reservation: ${error.message}`
        });

}
}
module.exports.getAllReservationsForUser=async(req,res)=>{
    try {
        const reservations = await Reservation.findAll({
            where: {
                user_id: req.params.id
            }
        });
        res.status(200).json({
            status:'success',
            data: reservations
        });
}catch(err){
    res.status(400).json({
        status: 'error',
        message: `Error getting reservations: ${error.message}`
    });
}
}




module.exports.acceptReservation = async (req, res) => {
    try {
        const { reservationId } = req.params;
        const driverId = req.user.id;

        const reservation = await Reservation.findByPk(reservationId);

        if (!reservation) {
            return res.status(404).json({
                status: 'error',
                message: 'Reservation not found'
            });
        }


        if (reservation.status !== 'Pending') {
            return res.status(400).json({
                status: 'error',
                message: 'Reservation is not in a Pending state'
            });
        }


        const driver = await User.findByPk(driverId);


        if (!driver || driver.role !== 'driver') {
            return res.status(403).json({
                status: 'error',
                message: 'Only drivers can accept reservations'
            });
        }


        if (reservation.driver_id && reservation.driver_id !== driverId) {
            return res.status(400).json({
                status: 'error',
                message: 'This reservation is already assigned to another driver'
            });
        }

        reservation.status = 'Confirmed';
        reservation.driver_id = driverId;
        await reservation.save();

        res.status(200).json({
            status: 'success',
            message: 'Reservation accepted successfully',
            data: reservation
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: `Error accepting reservation: ${error.message}`
        });
    }
};


module.exports.cancelReservation = async (req, res) => {
    try {
        const { reservationId } = req.params;

        const reservation = await Reservation.findByPk(reservationId);

        if (!reservation) {
            return res.status(404).json({
                status: 'error',
                message: 'Reservation not found'
            });
        }

        if (reservation.status === 'Pending') {
            return res.status(400).json({
                status: 'error',
                message: 'Reservation is already Pending'
            });
        }

        reservation.status = 'Pending';
        reservation.driver_id = null;
        await reservation.save();

        res.status(200).json({
            status: 'success',
            message: 'Reservation cancelled successfully',
            data: reservation
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: `Error cancelling reservation: ${error.message}`
        });
    }
};





module.exports.getAllReservationsByDriver = async (req, res) => {
    try {
        const driverId = req.user.id;

        const driverReservations = await Reservation.findAll({
            where: {
                driver_id: driverId
            },
            include: [
                {
                    model: User,
                    attributes: ['username'], }
            ]
        });

        res.status(200).json({
            status: 'success',
            data: driverReservations
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: `Error getting driver reservations: ${error.message}`
        });
    }
};

module.exports.getPendingReservations = async (req, res) => {
    try {
        const pendingReservations = await Reservation.findAll({
            where: {
                status: 'pending',
            },
            include: [
                {
                    model: User,
                    attributes: ['username'], }
            ]
        });

        res.status(200).json({
            status: 'success',
            message: 'Pending reservations retrieved successfully',
            data: pendingReservations
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: `Error fetching pending reservations: ${error.message}`
        });
    }
};

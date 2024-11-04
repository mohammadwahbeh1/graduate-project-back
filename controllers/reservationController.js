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


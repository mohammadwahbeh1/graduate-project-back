const Notification=require('../models/Notification');
module.exports.addNotifications = async(req,res)=>{

    try {
        const user_id = req.user.id; 
        const {message}=req.body;
        
        const notification = await Notification.create({
            user_id: user_id,
            message: message,

        });
        res.status(200).json({
            status:'success',
            message: 'Notification created successfully'
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: `Error creating notification: ${error.message}`
        });
        
    }
};

module.exports.getNotifications = async(req,res)=>{

    try {
        const user_id = req.user.id;
        const notifications = await Notification.findAll({
            where:{
                user_id:user_id,
                is_read: false,
                
            },
            order: [['created_at', 'DESC']]
        });
        res.status(200).json({
            status:'success',
            data: notifications
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: `Error fetching notifications: ${error.message}`
        });
        
    }

}

module.exports.markNotificationAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user.id;
        
        const [affectedRows] = await Notification.update(
            { is_read: true },
            {
                where: {
                    user_id: userId,
                    notification_id: notificationId,
                },
            }
        );

        if (affectedRows === 0) {
            // No rows updated, maybe the notification doesn't exist or is already marked as read
            return res.status(404).json({
                status: 'error',
                message: 'Notification not found or already marked as read.',
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Notification marked as read.',
        });
        
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: `Error marking notification as read: ${error.message}`,
        });
    }
};
module.exports.addNotificationsFromDriver=async (req,res)=>{

    try {
        const user_id = req.params.id; 
        const {message}=req.body;
        
        const notification = await Notification.create({
            user_id: user_id,
            message: message,

        });
        res.status(200).json({
            status:'success',
            message: 'Notification created successfully'
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: `Error creating notification: ${error.message}`
        });
        
    }
};


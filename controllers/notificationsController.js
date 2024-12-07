const Notification = require('../models/Notification');
const WebSocket = require('ws');

let wssInstance;

// Set WebSocket Server Instance
module.exports.setWebSocketServer = (wss) => {
    wssInstance = wss;
};

// Send notification to all or specific user via WebSocket
module.exports.sendNotification = (userId, message) => {
    console.log("Attempting to send notification to user:", userId);
    
    // Loop through all WebSocket clients
    wssInstance.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            console.log(`Checking client.userId: ${client.userId} against target userId: ${userId}`);
            
            // Send the message if the userIds match
            if (client.userId === userId) {
                console.log("Sending notification to the correct user");
                client.send(JSON.stringify({ message }));
            } else {
                console.log("No match for userId, skipping send");
            }
        }
    });
};


// Create a new notification and send it via WebSocket
module.exports.addNotifications = async (req, res) => {
    try {
        const user_id = req.user.id; 
        const { message } = req.body;

        const notification = await Notification.create({
            user_id: user_id,
            message: message,
        });

        // Send notification to WebSocket clients
        this.sendNotification(user_id, message);

        res.status(200).json({
            status: 'success',
            message: 'Notification created successfully'
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: `Error creating notification: ${error.message}`
        });
    }
};

// Get notifications for a user
module.exports.getNotifications = async (req, res) => {
    try {
        const user_id = req.user.id;
        const notifications = await Notification.findAll({
            where: {
                user_id: user_id,
                is_read: false,
            },
            order: [['created_at', 'DESC']]
        });

        res.status(200).json({
            status: 'success',
            data: notifications
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: `Error fetching notifications: ${error.message}`
        });
    }
};

// Mark a notification as read
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

// Add notifications from drivers
module.exports.addNotificationsFromDriver = async (req, res) => {
    try {
        const user_id = req.params.id; 
        const { message } = req.body;

        const notification = await Notification.create({
            user_id: user_id,
            message: message,
        });

        // Send notification to WebSocket clients
        this.sendNotification(user_id, message);
        console.log(" the user id issssssssssssssssssssssssssss  :: "+ user_id);

        res.status(200).json({
            status: 'success',
            message: 'Notification created successfully'
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: `Error creating notification: ${error.message}`
        });
    }
};

const express = require('express');
const morgan = require('morgan');
const swaggerAutogen = require('swagger-autogen')();
const swaggerUi = require('swagger-ui-express');
const http = require('http');
const WebSocket = require('ws');
const app = require('./app');
const notificationController = require('./controllers/notificationsController');
const Message = require('./models/Message');

// WebSocket clients map to track connections
const connectedClients = new Map();

// Swagger Configuration
const swaggerDoc = {
    info: {
        title: 'Naqalati API',
        description: 'API documentation for the Naqalati project',
    },
    host: 'localhost:3000',
    schemes: ['http'],
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./app.js'];

// Create the HTTP server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws/notifications' });

notificationController.setWebSocketServer(wss);

// WebSocket connection handler
wss.on('connection', (ws, req) => {
    console.log('New client connected via WebSocket');

    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const userId = urlParams.get('userId');
    ws.userId = userId;
    ws.isAvailable = true; // Set initial availability status

    // Store client connection
    connectedClients.set(userId, ws);
    console.log(`Client connected with userId: ${userId}`);
    console.log('Connected clients:', Array.from(connectedClients.keys()));

    // Message handler
    ws.on('message', async(message) => {
        try {
            const parsedMessage = JSON.parse(message);
            console.log('Received message:', parsedMessage);
            
            if (parsedMessage.type === 'chat') {
                await Message.create({
                    sender_id: userId,
                    receiver_id: parsedMessage.receiverId,
                    content: parsedMessage.content,
                    is_image: false,
                    timestamp: new Date(),
                    is_read: false,
                });
                
                const targetId = String(parsedMessage.receiverId);
                const targetClient = connectedClients.get(`${targetId}`);
                console.log(`the target id ${targetId} and the targetClient ${targetClient.userId}`);
                
                if (targetClient.readyState === WebSocket.OPEN) {
                    console.log(`Forwarding WebRTC message to client ${targetId}`);
                    targetClient.send(JSON.stringify({
                        type: 'chat',
                        senderId: userId,
                        receiverId: parsedMessage.receiverId,
                        content: parsedMessage.content,
                        timestamp: new Date()
                    }));
                }
            }

            if (parsedMessage.type === 'status') {
                // Update client's availability status
                const client = connectedClients.get(userId);
                if (client) {
                    client.isAvailable = parsedMessage.status === 'available';
                    console.log(`Client ${userId} availability status updated to: ${parsedMessage.status}`);
                }
            } else if (parsedMessage.type === 'webrtc') {
                const targetId = String(parsedMessage.targetId);
                const targetClient = connectedClients.get(targetId);

                if (targetClient && targetClient.readyState === WebSocket.OPEN) {
                    // Check if the target client is available
                    if (targetClient.isAvailable) {
                        console.log(`Forwarding WebRTC message to client ${targetId}`);
                        targetClient.send(JSON.stringify({
                            ...parsedMessage,
                            fromUserId: userId
                        }));
                    } else {
                        console.log(`Target client ${targetId} is unavailable`);
                        ws.send(JSON.stringify({
                            type: 'error',
                            message: 'Target user is unavailable'
                        }));
                    }
                } else {
                    console.log(`Target client ${targetId} not found or not connected`);
                    ws.send(JSON.stringify({
                        type: 'error',
                        message: 'Target user not connected'
                    }));
                }
            }
        } catch (error) {
            console.error('Message handling error:', error);
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Invalid message format'
            }));
        }
    });

    // Handle client disconnect
    ws.on('close', () => {
        console.log(`Client disconnected (userId: ${userId})`);

        connectedClients.delete(userId);
        console.log('Remaining clients:', Array.from(connectedClients.keys()));
    });

    // Handle errors
    ws.on('error', (error) => {
        console.error(`WebSocket error for client ${userId}:`, error);
        connectedClients.delete(userId);
    });
});

// Generate Swagger documentation and start server
swaggerAutogen(outputFile, endpointsFiles).then(() => {
    const swaggerDocument = require('./swagger_output.json');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use(morgan('tiny'));

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);











        console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
    });
});

// Export for testing purposes
module.exports = { server, wss };
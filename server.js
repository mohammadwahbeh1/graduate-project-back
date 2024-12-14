const express = require('express');
const morgan = require('morgan');
const swaggerAutogen = require('swagger-autogen')();
const swaggerUi = require('swagger-ui-express');
const http = require('http');
const WebSocket = require('ws');
const app = require('./app');
const notificationController = require('./controllers/notificationsController');

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

wss.on('connection', (ws, req) => {
    console.log('New client connected via WebSocket');

    // Attach userId from query parameter (e.g., /ws/notifications?userId=123)
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const userId = urlParams.get('userId');
    ws.userId = userId;
    console.log(`User connected with userId: ${userId}`);

    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
    });

    ws.on('close', () => {
        console.log(`Client disconnected (userId: ${userId})`);

    });
});

// Auto-generate Swagger documentation
swaggerAutogen(outputFile, endpointsFiles).then(() => {
    const swaggerDocument = require('./swagger_output.json');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use(morgan('tiny'));

    // Start the server using the HTTP server
    server.listen(3000, () => {
        console.log('Server is running on port 3000...');
        console.log('Swagger documentation is available at http://localhost:3000/api-docs');
    });
});

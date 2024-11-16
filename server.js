const express = require('express');
const morgan = require('morgan');
const swaggerAutogen = require('swagger-autogen')();
const swaggerUi = require('swagger-ui-express');

const app = require('./app');

// Swagger Configuration
const swaggerDoc = {
    info: {
        title: 'Naqalati API',
        description: 'API documentation for the Naqalati project',
    },
    host: 'localhost:3000',
    schemes: ['http'],
};

const outputFile = './swagger_output.json'; // File where Swagger JSON
const endpointsFiles = ['./app.js']; // File with all  routes

// Auto-generate Swagger documentation
swaggerAutogen(outputFile, endpointsFiles).then(() => {
    const swaggerDocument = require('./swagger_output.json'); // Import generated Swagger JSON

    // Serve Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // Middleware and server startup
    app.use(morgan('tiny'));
    app.listen(3000, () => {
        console.log('Server is running on port 3000...');
        console.log('Swagger documentation is available at http://localhost:3000/api-docs');
    });
});

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Naqalati', 'admin', 'Mode#2002', {
    host: 'naqalati.cxec8m8wuka0.eu-north-1.rds.amazonaws.com',
    dialect: 'mysql',
    port: 3306
});

sequelize.authenticate()
    .then(() => console.log('Connected to the MySQL database with Sequelize.'))
    .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;

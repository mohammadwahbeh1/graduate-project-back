const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Naqalati', 'admin', '903911865+', {
    host: 'aws-abbas.c5osoi48c22a.eu-north-1.rds.amazonaws.com',
    dialect: 'mysql',
    port: 3306
});

sequelize.authenticate()
    .then(() => console.log('Connected to the MySQL database with Sequelize.'))
    .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;

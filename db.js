const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sql12747705', 'sql12747705', 'xKS6nNdi5k', {
    host: 'sql12.freesqldatabase.com',
    dialect: 'mysql',
    port: 3306
});

sequelize.authenticate()
    .then(() => console.log('Connected to the MySQL database with Sequelize.'))
    .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;

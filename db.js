const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sql12758957', 'sql12758957', '5wBDh7wuiv', {
    host: 'sql12.freesqldatabase.com',
    dialect: 'mysql',
    port: 3306
});

sequelize.authenticate()
    .then(() => console.log('Connected to the MySQL database with Sequelize.'))
    .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;

const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User'); // Relation with User
const Reviews = require('./Reviews'); // Relation with User

const Terminal = sequelize.define('Terminal', {
    terminal_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    terminal_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
 
    total_vehicles: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    latitude: {
        type: DataTypes.DOUBLE,
        allowNull: true // Allowing null in case location is not set
    },
    longitude: {
        type: DataTypes.DOUBLE,
        allowNull: true // Allowing null in case location is not set
    },
}, {
    tableName: 'Terminals',
    timestamps: false
});

Terminal.belongsTo(User, { foreignKey: 'user_id', as: 'manager' });


Terminal.hasMany(Reviews, { foreignKey: 'terminal_id' });
Reviews.belongsTo(Terminal, { foreignKey: 'terminal_id' });


module.exports = Terminal;
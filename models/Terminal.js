const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User'); // Relation with User

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
    location_center: {
        type: DataTypes.GEOMETRY('POINT'),
        allowNull: true
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
    }
}, {
    tableName: 'Terminals',
    timestamps: false
});

module.exports = Terminal;

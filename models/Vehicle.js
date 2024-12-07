const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User'); // Relation with User
const Line = require('./Line'); // Relation with Line

const Vehicle = sequelize.define('Vehicle', {
    vehicle_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    driver_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    line_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Line,
            key: 'line_id'
        }
    },
    line_manager_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'user_id'
        },
        allowNull: true
    },
    current_status: {
        type: DataTypes.ENUM('on_the_way', 'in_terminal'),
        defaultValue: 'in_terminal'
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: true // Allowing null in case location is not set
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: true // Allowing null in case location is not set
    },
    previous_location_within_radius: {
    
    type: DataTypes.BOOLEAN,
        defaultValue: false
    }


}, {
    tableName: 'Vehicles',
    timestamps: false
});

// Defining relationships
Vehicle.belongsTo(Line, { foreignKey: 'line_id', as: 'line' });
Vehicle.belongsTo(User, { foreignKey: 'line_manager_id', as: 'line_manager' });
Vehicle.belongsTo(User, { foreignKey: 'driver_id', as: 'driver' });

module.exports = Vehicle;
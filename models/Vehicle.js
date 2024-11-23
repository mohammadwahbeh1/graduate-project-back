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
    line_manager_id: { // Adding the line_manager_id field
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'user_id'
        },
        allowNull: true // Allowing it to be NULL
    },
    current_status: {
        type: DataTypes.ENUM('on_the_way', 'in_terminal'),
        defaultValue: 'in_terminal'
    },
    current_location: {
        type: DataTypes.GEOMETRY('POINT'),
        allowNull: true
    }
}, {
    tableName: 'Vehicles',
    timestamps: false
});

// Defining relationships
Vehicle.belongsTo(Line, { foreignKey: 'line_id', as: 'line' });
Vehicle.belongsTo(User, { foreignKey: 'line_manager_id', as: 'line_manager' }); // Adding the relationship with Users for line_manager_id
Vehicle.belongsTo(User, { foreignKey: 'driver_id', as: 'driver' });

module.exports = Vehicle;

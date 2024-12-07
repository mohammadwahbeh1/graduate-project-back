const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User'); // Relation with User

const Reservation = sequelize.define('Reservation', {
    reservation_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'user_id'
        },
        allowNull: false
    },
    driver_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'user_id'
        },
        allowNull: true 
    },
    start_destination: {
        type: DataTypes.TEXT,
        allowNull: false 
    },
    end_destination: {
        type: DataTypes.TEXT,
        allowNull: false 
    },
    reservation_type: {
        type: DataTypes.ENUM('single', 'family'),
        allowNull: false
    },
    
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false 
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Confirmed', 'Cancelled'),
        defaultValue: 'Pending'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'Reservations',
    timestamps: false
});
Reservation.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Reservation, { foreignKey: 'user_id' });
module.exports = Reservation;

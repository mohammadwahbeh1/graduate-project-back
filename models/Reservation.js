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
        type: DataTypes.STRING(50),
        allowNull: false
    },
    end_destination: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Confirmed', 'Cancelled', 'Pause'),
        defaultValue: 'Pending'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    scheduled_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    scheduled_time: {
        type: DataTypes.TIME,
        allowNull: true
    },
    is_recurring: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true
    },
    recurrence_pattern: {
        type: DataTypes.ENUM('Weekly', 'Monthly'),
        allowNull: true
    },
    recurrence_interval: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: true
    },
    recurrence_end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    recurring_days: {
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
// models/DriverRating.js

const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const Reservation = require('./Reservation');

const DriverRating = sequelize.define('Driver_Ratings', {
    rating_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    reservation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Reservation,
            key: 'reservation_id'
        },
        onDelete: 'CASCADE'
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        },
        onDelete: 'CASCADE'
    },
    driver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        },
        onDelete: 'CASCADE'
    },
    rating: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        get() { // to get date  without time
            const rawValue = this.getDataValue('created_at');
            return rawValue ? rawValue.toISOString().split('T')[0] : null;
        }
    }
}, {
    tableName: 'Driver_Ratings',
    timestamps: false,
    indexes: [
        {
            name: 'idx_reservation_id',
            fields: ['reservation_id']
        },
        {
            name: 'idx_user_id',
            fields: ['user_id']
        },
        {
            name: 'idx_driver_id',
            fields: ['driver_id']
        }
    ]
});




module.exports = DriverRating;

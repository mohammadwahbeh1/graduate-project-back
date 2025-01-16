const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const DriverQue = sequelize.define(
    'DriverQue',
    {
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        phone_number: {
            type: DataTypes.STRING(15),
            allowNull: true,
        },
        date_of_birth: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        gender: {
            type: DataTypes.ENUM('Male', 'Female'),
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        license_image_path: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        tableName: 'Driver_Que',
        timestamps: false,
    }
);

module.exports = DriverQue;

// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const bcrypt= require('bcrypt');


const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone_number: {
        type: DataTypes.STRING,

        allowNull: false,

    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },

    role: {
        type: DataTypes.ENUM('user', 'driver', 'line_manager', 'admin'),
        allowNull: false

    }
}, {
    tableName: 'Users',
    timestamps: false,
    hooks: {
        beforeCreate: async (user) => {
            user.password = await bcrypt.hash(user.password_hash, 10);
        }
    }
    
    
});
User.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password_hash);
};

module.exports = User;

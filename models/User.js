const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const bcrypt = require('bcrypt');
const Reviews = require('./Reviews');

const User = sequelize.define(
    'User',
    {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('user', 'driver', 'line_manager', 'admin'),
            allowNull: false,
        },
        date_of_birth: {
            type: DataTypes.DATE,  
            allowNull: false, 
        },
        gender: {
            type: DataTypes.ENUM('Male', 'Female', 'Other'),  
            allowNull: false, 
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false, 
        },


        reset_code: {
            type: DataTypes.TEXT,
            allowNull: true,  
        },
        reset_code_expiry: {
            type: DataTypes.TIME,
            allowNull: true,  
        }

    },
    {
        tableName: 'Users',
        timestamps: false,  
    }
);

// Password validation
User.prototype.validPassword = async function (password) {
    console.log('Provided password:', password);
    console.log('Stored hash:', this.password_hash);
    
    const result = await bcrypt.compare(password, this.password_hash);
    console.log('Comparison result:', result);
    
    return result;
};

// Associations
User.hasMany(Reviews, { foreignKey: 'user_id' });
Reviews.belongsTo(User, { foreignKey: 'user_id' });


module.exports = User;

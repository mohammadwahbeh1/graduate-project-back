const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Reviews = sequelize.define(
    'Reviews',
    {
      review_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      terminal_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,

        onDelete: 'CASCADE',
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      rating: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      created_at: {
        type: DataTypes.TIME,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'Reviews',
      timestamps: false,
    }
);

module.exports = Reviews;

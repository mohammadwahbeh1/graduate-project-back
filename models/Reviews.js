const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Terminal = require('./Terminal');
const User = require('./User');

const Review = sequelize.define('Review', {
  review_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  terminal_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Terminal, 
      key: 'terminal_id'
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
  comment: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  rating: {
    type: DataTypes.TINYINT,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  created_at: {
    type: DataTypes.TIME,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Reviews',
  timestamps: false
});

module.exports = Review;
